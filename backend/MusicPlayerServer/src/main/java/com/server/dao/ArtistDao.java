package com.server.dao;

import com.server.model.Artist;
import com.server.utils.JpaUtilities;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class ArtistDao implements ISuperDao<Artist, Integer>{

    EntityManager em = JpaUtilities.getEntityManager();

    @Override
    public void save(Artist model) {
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
    public void update(Artist model) {
        try {
            em.getTransaction().begin();
            em.merge(model);
            em.getTransaction().commit();
        }catch (Exception e){
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }

    }

    @Override
    public void remove(Integer key) {
        try {
            em.getTransaction().begin();
            em.remove(em.find(Artist.class, key));
            em.getTransaction().commit();
        }catch (Exception e){
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }

    @Override
    public Artist find(Integer key){
        return em.find(Artist.class, key);
    }

    @Override
    public List<Artist> findAll() {
        TypedQuery<Artist> query = em.createQuery("SELECT a FROM Artist a", Artist.class);
        return query.getResultList();
    }


}
