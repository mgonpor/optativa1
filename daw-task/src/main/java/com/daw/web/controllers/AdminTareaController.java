package com.daw.web.controllers;

import java.util.List;

import com.daw.services.exceptions.TareaSecurityException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.daw.persistence.entities.Tarea;
import com.daw.services.TareaService;
import com.daw.services.exceptions.TareaException;
import com.daw.services.exceptions.TareaNotFoundException;

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
		try{
			return ResponseEntity.ok(tareaService.findById(idTarea));
		}catch (TareaNotFoundException e){
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@PostMapping
	public ResponseEntity<?> create(@RequestBody Tarea tarea) {
		try {
			return ResponseEntity.status(HttpStatus.CREATED).body(this.tareaService.create(tarea));
		} catch (TareaException ex) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
		}
	}

	@PutMapping("/{idTarea}")
	public ResponseEntity<?> update(@PathVariable int idTarea, @RequestBody Tarea tarea) {
		try {
			return ResponseEntity.ok(this.tareaService.update(tarea, idTarea));
		} catch (TareaNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		} catch (TareaException ex) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
		}
	}

	@DeleteMapping("/{idTarea}")
	public ResponseEntity<?> delete(@PathVariable int idTarea) {

		try {
			this.tareaService.delete(idTarea);
			return ResponseEntity.ok().build();
		} catch (TareaNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}
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
