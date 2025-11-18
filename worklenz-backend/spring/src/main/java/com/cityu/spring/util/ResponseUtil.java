package com.cityu.spring.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.cityu.spring.response.ApiResponse;

public class ResponseUtil {

    public static <T> ResponseEntity<ApiResponse<T>> success(String message, T data) {
        return ResponseEntity.ok(new ApiResponse<>(true, message, data));
    }

    public static <T> ResponseEntity<ApiResponse<T>> failure(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(new ApiResponse<>(false, message, null));
    }
}
//使用方式return ResponseUtil.success("查询成功", tasks);
