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
@RequestMapping("/tareas")
public class TareaController {

	@Autowired
	private TareaService tareaService;

	// ADMIN
	@GetMapping("/admin")
	public ResponseEntity<List<Tarea>> findAll(){
		return ResponseEntity.ok(tareaService.findAll());
	}

	@GetMapping("/admin/{idTarea}")
	public ResponseEntity<?> findById(@PathVariable int idTarea){
		try{
			return ResponseEntity.ok(tareaService.findById(idTarea));
		}catch (TareaNotFoundException e){
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@PostMapping("/admin")
	public ResponseEntity<?> create(@RequestBody Tarea tarea) {
		try {
			return ResponseEntity.status(HttpStatus.CREATED).body(this.tareaService.create(tarea));
		} catch (TareaException ex) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
		}
	}

	@PutMapping("/admin/{idTarea}")
	public ResponseEntity<?> update(@PathVariable int idTarea, @RequestBody Tarea tarea) {
		try {
			return ResponseEntity.ok(this.tareaService.update(tarea, idTarea));
		} catch (TareaNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		} catch (TareaException ex) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
		}
	}

	@DeleteMapping("/admin/{idTarea}")
	public ResponseEntity<?> delete(@PathVariable int idTarea) {

		try {
			this.tareaService.delete(idTarea);
			return ResponseEntity.ok().build();
		} catch (TareaNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}
	}

	// -----------------
	// ADMIN y USER
	@PutMapping("/admin/{idTarea}/iniciar")
	public ResponseEntity<?> iniciarTarea(@PathVariable int idTarea){
		try {
			return ResponseEntity.ok(this.tareaService.marcarEnProgreso(idTarea));
		} catch (TareaNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		} catch (TareaException ex) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
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

	// -------------
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


}
