package com.server.dao;

import com.server.model.LikedSongId;
import com.server.model.Liked_Song;
import com.server.model.Song;
import com.server.model.User;
import com.server.utils.JpaUtilities;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;


public class Liked_SongDao implements ISuperDao<Liked_Song, LikedSongId>{

    EntityManager em = JpaUtilities.getEntityManager();

    @Override
    public void save(Liked_Song model) {
        try {
            em.getTransaction().begin();
            em.persist(model);
            em.getTransaction().commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }

    public void save(int userId, int songId) {
        try {
            em.getTransaction().begin();
            User user = em.find(User.class, userId);
            Song song = em.find(Song.class, songId);
            if(user == null || song == null) {
                throw new IllegalArgumentException("No user or song in the database !");
            }
            LikedSongId id = new LikedSongId(user.getUserId(), song.getSongId());
            Liked_Song model = new Liked_Song(id, user, song, getPosition(userId));
            em.persist(model);
            em.getTransaction().commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }


    @Override
    public void update(Liked_Song model) {
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
    public void remove(LikedSongId key) {

    }

    public void remove(int userId, int songId) {
        try {
            em.getTransaction().begin();
            User user = em.find(User.class, userId);
            Song song = em.find(Song.class, songId);
            if(user == null || song == null) {
                throw new IllegalArgumentException("No user or song in the database !");
            }
            LikedSongId id = new LikedSongId(user.getUserId(), song.getSongId());
            em.remove(find(id));
            em.getTransaction().commit();
        } catch (Exception e) {
            em.getTransaction().rollback();
        }
    }

    @Override
    public Liked_Song find(LikedSongId key) {
        return em.find(Liked_Song.class, key);
    }

    @Override
    public List<Liked_Song> findAll() {
        return List.of();
    }

    public List<Liked_Song> findLikedSongOfUser(int userId){
        TypedQuery<Liked_Song> query = em.createQuery("SELECT l_s FROM Liked_Song l_s WHERE l_s.id.userId=:id", Liked_Song.class)
                                         .setParameter("id", userId);
        return query.getResultList();
    }

    int getPosition(int id) {
        Integer position = em.createQuery("SELECT MAX(l_s.positionInListLiked) FROM Liked_Song l_s WHERE l_s.id.userId=:id", Integer.class)
                .setParameter("id", id)
                .getSingleResult();
        return position == null ? 1 : position + 1;
    }


}
