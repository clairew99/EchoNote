package com.echonote.domain.note.service;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.echonote.domain.User.dao.UserRepository;
import com.echonote.domain.User.entity.User;
import com.echonote.domain.note.dao.NoteRepository;
import com.echonote.domain.note.dto.NoteCreateRequest;
import com.echonote.domain.note.dto.NoteCreateResponse;
import com.echonote.domain.note.dto.PresignedUrlResponse;
import com.echonote.domain.note.entity.Note;
import com.echonote.global.aop.exception.BusinessLogicException;
import com.echonote.global.aop.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

	private final UserRepository userRepository;
	private final NoteRepository noteRepository;

	@Autowired
	private AmazonS3 amazonS3;

	public PresignedUrlResponse generatePreSignUrl(String filePath,
		String bucketName,
		HttpMethod httpMethod) {

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		calendar.add(Calendar.MINUTE, 10); //validfy of 10 minutes

		PresignedUrlResponse res = new PresignedUrlResponse();
		res.setPresignedUrl(
			amazonS3.generatePresignedUrl(bucketName, filePath, calendar.getTime(), httpMethod).toString());

		return res;

	}

	@Override
	public NoteCreateResponse addNote(Long userId, NoteCreateRequest noteCreateRequest) {

		User user = userRepository.findById(userId)
			.orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND));

		Note note = Note.builder()
			.user(user)
			.pdf_path(noteCreateRequest.getPresignedUrl())
			.create_at(LocalDateTime.now()).build();

		NoteCreateResponse res = new NoteCreateResponse();
		res.setNoteId(noteRepository.save(note).getId());

		return res;
	}
}
