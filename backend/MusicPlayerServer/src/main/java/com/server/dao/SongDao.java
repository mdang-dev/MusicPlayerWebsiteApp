package com.server.dao;

import com.server.model.Song;
import com.server.utils.JpaUtilities;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class SongDao implements ISuperDao<Song, Integer>{

    EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPA");
    EntityManager em = emf.createEntityManager();

    @Override
    public void save(Song model) {
        try {
            em.getTransaction().begin();
            em.persist(model);
            em.getTransaction().commit();
        }catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }

    public int saveAndReturn(Song model) {
        try {
            em.getTransaction().begin();
            this.em.persist(model);
            em.getTransaction().commit();
            return model.getSongId();
        }catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
            return 0;
        }

    }

    @Override
    public void update(Song model) {
        try {
            em.getTransaction().begin();
            em.merge(model);
            em.getTransaction().commit();
        }catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }

    @Override
    public void remove(Integer key) {
        try {
            em.getTransaction().begin();
            Song entity = em.find(Song.class, key);
            em.remove(entity);
            em.getTransaction().commit();
        }catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }

    @Override
    public Song find(Integer key) {
        return em.find(Song.class, key);
    }

    @Override
    public List<Song> findAll() {
        em.clear();
       TypedQuery<Song> query = em.createQuery("SELECT s FROM Song s", Song.class);
       return query.getResultList();
    }

    public List<Song> findTop10SongPlays(){
        em.clear();
        TypedQuery<Song> query = em.createQuery("SELECT s FROM Song s ORDER BY s.plays DESC", Song.class).setMaxResults(10);
        return query.getResultList();
    }

    public List<Object[]> findTop10SongLiked() {
        EntityManager em = JpaUtilities.getEntityManager();
        String jpql = "SELECT ls.song.songId, ls.song.songName, COUNT(ls) " +
                "FROM Liked_Song ls " +
                "GROUP BY ls.song.songId, ls.song.songName " +
                "ORDER BY COUNT(ls) ASC";
        return em.createQuery(jpql, Object[].class).getResultList();
    }

}
