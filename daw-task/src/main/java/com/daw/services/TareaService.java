package com.daw.services;

import java.time.LocalDate;
import java.util.List;

import com.daw.persistence.entities.Usuario;
import com.daw.services.exceptions.TareaSecurityException;
import com.daw.services.exceptions.UsuarioNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.daw.persistence.entities.Estado;
import com.daw.persistence.entities.Tarea;
import com.daw.persistence.repositories.TareaRepository;
import com.daw.services.exceptions.TareaException;
import com.daw.services.exceptions.TareaNotFoundException;

@Service
public class TareaService {

	// findAll
	// findById
	// save (crear y actualizar)
	// deleteById
	// existsById (nos devuelve true si existe la tarea con esa ID)

	@Autowired
	private TareaRepository tareaRepository;

	@Autowired
	private UsuarioService usuarioService;

	// ADMIN
	// findAll
	public List<Tarea> findAll() {
		return this.tareaRepository.findAll();
	}

	// findById
	public Tarea findById(int idTarea) {
		if (!this.tareaRepository.existsById(idTarea)) {
			throw new TareaNotFoundException("La tarea con id " + idTarea + " no existe. ");
		}

		return this.tareaRepository.findById(idTarea).get();
	}

	// create
	public Tarea create(Tarea tarea) {
		if (tarea.getFechaVencimiento().isBefore(LocalDate.now())) {
			throw new TareaException("La fecha de vencimiento debe ser posterior. ");
		}
		if (tarea.getEstado() != null) {
			throw new TareaException("No se puede modificar el estado. ");
		}
		if (tarea.getFechaCreacion() != null) {
			throw new TareaException("No se puede modificar la fecha de creación. ");
		}
		if(tareaRepository.existsTareaByIdUsuario(tarea.getIdUsuario())) {
			throw new UsuarioNotFoundException("Usuario con id " + tarea.getIdUsuario() + " no existe. ");
		}

		tarea.setId(0);
		tarea.setFechaCreacion(LocalDate.now());
		tarea.setEstado(Estado.PENDIENTE);

		return this.tareaRepository.save(tarea);
	}

	// update
	public Tarea update(Tarea tarea, int idTarea) {
		if (tarea.getId() != idTarea) {
			throw new TareaException(
					String.format("El id del body (%d) y el id del path (%d) no coinciden", tarea.getId(), idTarea));
		}
		if (!this.tareaRepository.existsById(idTarea)) {
			throw new TareaNotFoundException("La tarea con id " + idTarea + " no existe. ");
		}
		if (tarea.getEstado() != null) {
			throw new TareaException("No se puede modificar el estado. ");
		}
		if (tarea.getFechaCreacion() != null) {
			throw new TareaException("No se puede modificar la fecha de creación. ");
		}
		if(tareaRepository.existsTareaByIdUsuario(tarea.getIdUsuario())) {
			throw new UsuarioNotFoundException("Usuario con id " + tarea.getIdUsuario() + " no existe. ");
		}

		// Recupero la tarea que está en BBDD y modifico solo los campos permitidos.
		// Si guardo directamente tarea, voy a poner a null la fecha de creación y el
		// estado.
		Tarea tareaBD = this.findById(idTarea);
		tareaBD.setDescripcion(tarea.getDescripcion());
		tareaBD.setTitulo(tarea.getTitulo());
		tareaBD.setFechaVencimiento(tarea.getFechaVencimiento());

		return this.tareaRepository.save(tareaBD);
	}

	// delete
	public void delete(int idTarea) {
		if (!this.tareaRepository.existsById(idTarea)) {
			throw new TareaNotFoundException("La tarea no existe");
		}
		this.tareaRepository.deleteById(idTarea);
	}

	public Tarea marcarEnProgreso(int idTarea) {
		Tarea tarea = this.findById(idTarea);
		// comprobar que sea el usuario o admin
		if (!perteneceTarea(idTarea) ||
						this.usuarioService.findByUsername(
							SecurityContextHolder.getContext().getAuthentication().getName())
						.getRol().equals("ADMIN")) {
			throw new TareaSecurityException("La tarea no pertenece al usuario");
		}

		if (!tarea.getEstado().equals(Estado.PENDIENTE)) {
			throw new TareaException("La tarea ya está completada o ya está en progreso");
		}

		tarea.setEstado(Estado.EN_PROGRESO);
		return this.tareaRepository.save(tarea);
	}
	
//	Obtener las tareas pendientes.
	public List<Tarea> pendientes() {
		return this.tareaRepository.findByEstado(Estado.PENDIENTE);
	}
	
//	Obtener las tareas en progreso.
	public List<Tarea> enProgreso() {
		return this.tareaRepository.findByEstado(Estado.EN_PROGRESO);
	}
//	Obtener las tareas completadas.
	public List<Tarea> completadas() {
		return this.tareaRepository.findByEstado(Estado.COMPLETADA);
	}


	// --------------
	// USER

	//findAll
	public List<Tarea> findAllByUser() {
		if(SecurityContextHolder.getContext().getAuthentication().getAuthorities()
				.contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
			return this.findAll();
		}
		return this.tareaRepository.findByUsuarioUsername(
				SecurityContextHolder.getContext().getAuthentication().getName());
	}

	//findById
	public Tarea findByIdByUser(int idTarea){
		if (!perteneceTarea(idTarea)) {
			throw new TareaSecurityException("La tarea no pertenece al usuario");
		}
		return this.findById(idTarea);
	}

	public Tarea createByUser(Tarea tarea){
		if (!perteneceTarea(tarea.getIdUsuario())) {
			throw new TareaSecurityException("La tarea no pertenece al usuario");
		}
		return this.create(tarea);
	}

	public Tarea updateByUser(Tarea tarea, int idTarea){
		if (!perteneceTarea(idTarea)) {
			throw new TareaSecurityException("La tarea no pertenece al usuario");
		}
		return this.update(tarea, idTarea);
	}

	public void deleteByUser(int idTarea){
		if (!perteneceTarea(idTarea)) {
			throw new TareaSecurityException("La tarea no pertenece al usuario");
		}
		this.delete(idTarea);
	}

	//aux solo USER
	private boolean perteneceTarea(int idTarea) {
		Usuario u = this.usuarioService.findByUsername(
				SecurityContextHolder.getContext().getAuthentication().getName());
		Tarea t = this.findById(idTarea);

		return u.getId() == t.getUsuario().getId();
	}
}
