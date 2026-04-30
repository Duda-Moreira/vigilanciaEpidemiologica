package com.monitoramento.epidemia.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.monitoramento.epidemia.model.Caso;
import com.monitoramento.epidemia.service.CasoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/casos")
@CrossOrigin(origins = "*")
public class CasoController {

    private final CasoService casoService;

    public CasoController(CasoService casoService) {
        this.casoService = casoService;
    }

    @PostMapping
    public ResponseEntity<Caso> criar(@Valid @RequestBody Caso caso) {
        Caso casoCriado = casoService.criar(caso);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(casoCriado.getId())
                .toUri();

        return ResponseEntity.created(uri).body(casoCriado);
    }

    @GetMapping
    public ResponseEntity<List<Caso>> listarTodos() {
        return ResponseEntity.ok(casoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Caso> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(casoService.buscarPorId(id));
    }

    @GetMapping("/cidade/{cidade}")
    public ResponseEntity<List<Caso>> buscarPorCidade(@PathVariable String cidade) {
        return ResponseEntity.ok(casoService.buscarPorCidade(cidade));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Caso> atualizar(@PathVariable Long id, @Valid @RequestBody Caso caso) {
        return ResponseEntity.ok(casoService.atualizar(id, caso));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        casoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}