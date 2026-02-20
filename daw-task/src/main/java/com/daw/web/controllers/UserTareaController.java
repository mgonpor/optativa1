package com.daw.web.controllers;

import com.daw.persistence.entities.Tarea;
import com.daw.services.TareaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/tareas")
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
        return ResponseEntity.ok(this.tareaService.findByIdByUser(idTarea));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Tarea tarea) {
        return ResponseEntity.ok(this.tareaService.createByUser(tarea));
    }

    @PutMapping("/{idTarea}/iniciar")
    public ResponseEntity<?> iniciarTarea(@PathVariable int idTarea){
        return ResponseEntity.ok(this.tareaService.marcarEnProgreso(idTarea));
    }

    @PutMapping("/{idTarea}/completar")
    public ResponseEntity<?> completarTarea(@PathVariable int idTarea){
        return ResponseEntity.ok(this.tareaService.marcarCompletada(idTarea));
    }

    @PutMapping("/{idTarea}/iniciar")
    public ResponseEntity<?> iniciarTarea(@PathVariable int idTarea){
        try {
            return ResponseEntity.ok(this.tareaService.marcarEnProgreso(idTarea));
        } catch (TareaNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (TareaException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }catch (TareaSecurityException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping("/{idTarea}/completar")
    public ResponseEntity<?> completarTarea(@PathVariable int idTarea){
        try{
            return ResponseEntity.ok(this.tareaService.marcarCompletada(idTarea));
        }catch (TareaNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }catch (TareaException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }catch (TareaSecurityException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

}
