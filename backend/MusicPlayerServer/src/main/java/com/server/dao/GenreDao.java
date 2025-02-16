package com.server.dao;

import com.server.model.Genre;
import com.server.utils.JpaUtilities;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class GenreDao implements ISuperDao<Genre, Integer>{

    EntityManager em = JpaUtilities.getEntityManager();

    @Override
    public void save(Genre model) {
        try {
            em.getTransaction().begin();
            em.persist(model);
            em.getTransaction().commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }

    @Override
    public void update(Genre model) {
        try {
            em.getTransaction().begin();
            em.merge(model);
            em.getTransaction().commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }

    @Override
    public void remove(Integer key) {
        try {
            em.getTransaction().begin();
            em.remove(em.find(Genre.class, key));
            em.getTransaction().commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }

    @Override
    public Genre find(Integer key) {
        return em.find(Genre.class, key);
    }

    @Override
    public List<Genre> findAll() {
        TypedQuery<Genre> query = em.createQuery("SELECT g FROM Genre g", Genre.class);
        return query.getResultList();
    }


}
