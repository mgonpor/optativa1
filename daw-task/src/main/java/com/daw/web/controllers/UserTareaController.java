package com.daw.web.controllers;

import com.daw.persistence.entities.Tarea;
import com.daw.services.TareaService;
import org.springframework.beans.factory.annotation.Autowired;
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
        return ResponseEntity.ok(this.tareaService.findByIdByUser(idTarea));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Tarea tarea) {
        return ResponseEntity.ok(this.tareaService.createByUser(tarea));
    }

    @PutMapping("/{idTarea}")
    public ResponseEntity<?> update(@RequestBody Tarea tarea, @PathVariable int idTarea) {
        return ResponseEntity.ok(this.tareaService.updateByUser(tarea, idTarea));
    }

    @DeleteMapping("/{idTarea}")
    public ResponseEntity<?> delete(@PathVariable int idTarea) {
        this.tareaService.deleteByUser(idTarea);
        return ResponseEntity.ok("Tarea" + idTarea + " eliminada con éxito.");
    }

}
