package com.monitoramento.epidemia.repository;

import com.monitoramento.epidemia.model.Caso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CasoRepository extends JpaRepository<Caso, Long> {

    List<Caso> findByCidade(String cidade);
}