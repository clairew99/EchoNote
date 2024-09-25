package com.echonote.domain.Voice.controller;

import java.util.UUID;

import com.amazonaws.HttpMethod;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.echonote.domain.Voice.Service.VoiceServiceImpl;
import com.echonote.domain.Voice.dto.S3SaveResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/voice")
@Tag(name = "voice", description = "voice api")
public class VoiceController {
	private final VoiceServiceImpl voiceService;

	@Value("${amazon.aws.bucket}")
	private String bucketName;

	// 확장자명에 따라 presigned url 반환
	@GetMapping
	@Operation(summary = "presigned url 반환", description = "클라이언트에서 녹음한 wav 파일 업로드 위한 S3 presigned url 반환")
	public ResponseEntity<S3SaveResponse> generatePresignedUrl() {

		S3SaveResponse response = voiceService.generatePreSignUrl(UUID.randomUUID() + ".wav", bucketName,
			HttpMethod.PUT);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
