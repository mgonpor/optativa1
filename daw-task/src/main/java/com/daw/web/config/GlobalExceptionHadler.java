package com.daw.web.config;

import com.daw.services.exceptions.TareaException;
import com.daw.services.exceptions.TareaNotFoundException;
import com.daw.services.exceptions.TareaSecurityException;
import com.daw.services.exceptions.UsuarioNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHadler {

    @ExceptionHandler(TareaNotFoundException.class)
    public ResponseEntity<String> handleTareaNotFound(TareaNotFoundException e){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(UsuarioNotFoundException.class)
    public ResponseEntity<String> handleUsuarioNotFound(UsuarioNotFoundException e){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(TareaException.class)
    public ResponseEntity<String> handleTareaException(TareaException e){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(TareaSecurityException.class)
    public ResponseEntity<String> handleTareaSecurityException(TareaSecurityException e){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
    }

}
