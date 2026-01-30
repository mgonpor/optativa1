package com.daw.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.daw.persistence.entities.Tarea;
import com.daw.services.TareaService;

@RestController
@RequestMapping("/admin/tareas")
public class AdminTareaController {

	@Autowired
	private TareaService tareaService;

	// ADMIN
	@GetMapping
	public ResponseEntity<List<Tarea>> findAll(){
		return ResponseEntity.ok(tareaService.findAll());
	}

	@GetMapping("/{idTarea}")
	public ResponseEntity<?> findById(@PathVariable int idTarea){
		return ResponseEntity.ok(tareaService.findById(idTarea));
	}

	@PostMapping
	public ResponseEntity<?> create(@RequestBody Tarea tarea) {
		return ResponseEntity.status(HttpStatus.CREATED).body(this.tareaService.create(tarea));
	}

	@PutMapping("/{idTarea}")
	public ResponseEntity<?> update(@PathVariable int idTarea, @RequestBody Tarea tarea) {
		return ResponseEntity.ok(this.tareaService.update(tarea, idTarea));
	}

	@DeleteMapping("/{idTarea}")
	public ResponseEntity<?> delete(@PathVariable int idTarea) {
		this.tareaService.delete(idTarea);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/{idTarea}/iniciar")
	public ResponseEntity<?> iniciarTarea(@PathVariable int idTarea){
		return ResponseEntity.ok(this.tareaService.marcarEnProgreso(idTarea));
	}

	@GetMapping("/pendientes")
	public ResponseEntity<?> pendientes(){
		return ResponseEntity.ok(this.tareaService.pendientes());
	}

	@GetMapping("/en-progreso")
	public ResponseEntity<?> enProgreso(){
		return ResponseEntity.ok(this.tareaService.enProgreso());
	}

	@GetMapping("/completadas")
	public ResponseEntity<?> completadas(){
		return ResponseEntity.ok(this.tareaService.completadas());
	}

}
