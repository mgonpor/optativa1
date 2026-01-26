package com.daw.web.controllers;

import com.daw.persistence.entities.Tarea;
import com.daw.services.TareaService;
import com.daw.services.exceptions.TareaException;
import com.daw.services.exceptions.TareaNotFoundException;
import com.daw.services.exceptions.TareaSecurityException;
import com.daw.services.exceptions.UsuarioNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserTareaController {

    @Autowired
    private TareaService tareaService;

    //USER
    @GetMapping
    public ResponseEntity<List<Tarea>> list() {
        return ResponseEntity.ok(this.tareaService.findAllByUser());
    }

    @GetMapping("/{idTarea}")
    public ResponseEntity<?> findByIdUser(@PathVariable int idTarea) {
        try {
            return ResponseEntity.ok(this.tareaService.findByIdByUser(idTarea));
        } catch (TareaNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (TareaSecurityException e){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Tarea tarea) {
        try {
            return ResponseEntity.ok(this.tareaService.createByUser(tarea));
        }catch (TareaSecurityException e){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }catch (TareaException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }catch (UsuarioNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{idTarea}")
    public ResponseEntity<?> update(@RequestBody Tarea tarea, @PathVariable int idTarea) {
        try{
            return ResponseEntity.ok(this.tareaService.updateByUser(tarea, idTarea));
        }catch (TareaSecurityException e){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }catch (TareaException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }catch (UsuarioNotFoundException | TareaNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{idTarea}")
    public ResponseEntity<?> delete(@PathVariable int idTarea) {
        try{
            this.tareaService.deleteByUser(idTarea);
            return ResponseEntity.ok("Tarea" + idTarea + " eliminada con éxito.");
        }catch (TareaSecurityException e){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }catch (TareaNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
