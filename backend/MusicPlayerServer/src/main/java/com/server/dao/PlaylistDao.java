package com.server.dao;

import com.server.mapper.PlaylistMapper;
import com.server.model.Playlist;
import com.server.model.User;
import com.server.utils.JpaUtilities;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class PlaylistDao implements ISuperDao<Playlist, String>{

    EntityManager em = JpaUtilities.getEntityManager();

    @Override
    public void save(Playlist model) {
        try {
            em.getTransaction().begin();
            em.persist(model);
            em.getTransaction().commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }

    public void save(PlaylistMapper mapper) {
        try {
            em.getTransaction().begin();
            Playlist model = new Playlist(em.find(User.class, mapper.getUserId()), mapper.getPlaylistName());
            em.persist(model);
            em.getTransaction().commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }

    public void update(PlaylistMapper mapper) {
        try {
            em.getTransaction().begin();
            Playlist model = em.find(Playlist.class, mapper.getPlaylistId());
            model.setPlaylistName(mapper.getPlaylistName());
            em.merge(model);
            em.getTransaction().commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }
    @Override
    public void update(Playlist model) {
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
    public void remove(String key) {
        try {
            em.getTransaction().begin();
            em.createQuery("DELETE FROM Playlist_Song p_s WHERE p_s.id.playlistId=:id")
                    .setParameter("id", key)
                    .executeUpdate();
            em.remove(em.find(Playlist.class, key));
            em.getTransaction().commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }

    @Override
    public Playlist find(String key) {
        return null;
    }

    @Override
    public List<Playlist> findAll() {
        TypedQuery<Playlist> query = em.createQuery("SELECT p FROM Playlist p", Playlist.class);
        return query.getResultList();
    }

    public List<Playlist> findPlaylistOfUser(int userId) {
        TypedQuery<Playlist> query =  em.createQuery("SELECT p FROM Playlist p WHERE p.user.userId=:id", Playlist.class)
                                        .setParameter("id", userId);
        return query.getResultList();
    }

}
