package com.monitoramento.epidemia.service;

import com.monitoramento.epidemia.exception.RecursoNaoEncontradoException;
import com.monitoramento.epidemia.model.Caso;
import com.monitoramento.epidemia.repository.CasoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CasoService {

    private final CasoRepository casoRepository;

    public CasoService(CasoRepository casoRepository) {
        this.casoRepository = casoRepository;
    }

    public Caso criar(Caso caso) {
        return casoRepository.save(caso);
    }

    @Transactional(readOnly = true)
    public List<Caso> listarTodos() {
        return casoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Caso buscarPorId(Long id) {
        return casoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Caso não encontrado com ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Caso> buscarPorCidade(String cidade) {
        return casoRepository.findByCidade(cidade);
    }

    public Caso atualizar(Long id, Caso casoAtualizado) {
        Caso casoExistente = buscarPorId(id);
        casoExistente.setCidade(casoAtualizado.getCidade());
        casoExistente.setDataColeta(casoAtualizado.getDataColeta());
        casoExistente.setCasos(casoAtualizado.getCasos());
        casoExistente.setPopulacao(casoAtualizado.getPopulacao());
        return casoRepository.save(casoExistente);
    }

    public void deletar(Long id) {
        Caso caso = buscarPorId(id);
        casoRepository.delete(caso);
    }
}