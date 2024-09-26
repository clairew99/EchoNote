package com.echonote.domain.Memo.service;

import com.echonote.domain.Memo.dao.MemoRepository;
import com.echonote.domain.Memo.dto.MemoRequest;
import com.echonote.domain.Memo.entity.Memo;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemoServiceImpl implements MemoService {

    private final MemoRepository memoRepository;

    private final MongoTemplate mongoTemplate;

    // MongoDB에 메모 추가
    @Override
    public void insertMemo(Memo list) {
        memoRepository.insert(list);
    }

    // 메모 업데이트
    @Override
    public void updateMemo (Memo list){
        long id = list.getId();

        for(MemoRequest.memoDto memo : list.getMemo()){
            Query query = new Query(Criteria.where("_id").is(id).and("memo._id").is(memo.getId()));
            Update update = new Update().set("memo.$.memo", memo.getMemo());

            // 업데이트 실행
            try {
                UpdateResult result = mongoTemplate.updateFirst(query, update, Memo.class);

                if (result.getMatchedCount() == 0) { // 새로운 메모 id를 삽입할 시
                    // 기존 메모 목록에 새로운 메모 추가
                    Query insertQuery = new Query(Criteria.where("_id").is(id));
                    Update insertUpdate = new Update().push("memo", memo); // 메모 배열에 추가
                    mongoTemplate.updateFirst(insertQuery, insertUpdate, Memo.class);

                }
            } catch (DataIntegrityViolationException e) {
                System.err.println("데이터 무결성 위반: " + e.getMessage());
            }
        }
    }

    // 메모 삭제하기
    @Override
    public void deleteMemo(long id, List<Long> memoId){
        for(long memo : memoId) {
            // memoId는 전체 메모 ID (부모 ID), targetMemoId는 삭제할 메모의 ID입니다.
            Query query = new Query(Criteria.where("id").is(id).and("memo.id").is(memo));
            // 업데이트 명령어로 해당 메모 ID를 삭제
            Update update = new Update().pull("memo", new Query(Criteria.where("id").is(memo)));

            // 삭제 실행
            try {
                UpdateResult result = mongoTemplate.updateFirst(query, update, Memo.class);

                if (result.getMatchedCount() > 0) {
                    System.out.println("메모가 성공적으로 삭제되었습니다: " + memo);
                } else {
                    System.out.println("해당 메모 항목을 찾을 수 없습니다: " + memo);
                }
            } catch (DataIntegrityViolationException e) {
                System.err.println("데이터 무결성 위반: " + e.getMessage());
            }
        }

    }

    // 특정 ID로 데이터를 가져오기
    @Override
    public Memo findById(long id) {
        return memoRepository.findById(id).orElse(null);
    }

}
