package com.daw.persistence.repositories;

import java.util.List;

import org.springframework.data.repository.ListCrudRepository;

import com.daw.persistence.entities.Estado;
import com.daw.persistence.entities.Tarea;

public interface TareaRepository extends ListCrudRepository<Tarea, Integer> {
	
	List<Tarea> findByEstado(Estado estado);
	
//	Obtener las tareas vencidas (fecha de vencimiento menor que la de hoy).
//	Obtener las tareas no vencidas (fecha de vencimiento mayor que la de hoy).
//	Obtener tareas mediante su título (que contenga el String que se pasa como título).


}
