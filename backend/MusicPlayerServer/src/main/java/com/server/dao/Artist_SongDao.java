package com.server.dao;

import com.server.model.*;
import com.server.utils.JpaUtilities;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.hibernate.Hibernate;

import java.util.List;

public class Artist_SongDao implements ISuperDao<Artist_Song, ArtistSongId>{


    EntityManager em = JpaUtilities.getEntityManager();

    @Override
    public void save(Artist_Song model) {
        try {
            em.getTransaction().begin();
            em.persist(model);
            em.getTransaction().commit();
        }catch (Exception e){
            em.getTransaction().rollback();
        }
    }

    public void save(int artistId, int songId) {
        try {
            em.getTransaction().begin();

            Artist artist = em.find(Artist.class, artistId);
            Song song = em.find(Song.class, songId);

            if (artist == null || song == null) {
                throw new IllegalArgumentException("Artist or Song not found");
            }

            ArtistSongId id = new ArtistSongId(artistId, songId);
            Artist_Song artistSong = new Artist_Song(id, artist, song);
            em.persist(artistSong);
            song.getArtistSongs().add(artistSong);
            artist.getArtistSongs().add(artistSong);
            em.flush();
            em.detach(song);
            em.getTransaction().commit();
            em.clear();
        }catch (Exception e){
            em.getTransaction().rollback();
        }
    }

    @Override
    public void update(Artist_Song model) {
        try {
            em.getTransaction().begin();
            em.merge(model);
            em.getTransaction().commit();
        }catch (Exception e){
            em.getTransaction().rollback();
        }
    }

    @Override
    public void remove(ArtistSongId key) {
        em.createQuery("DELETE FROM Playlist_Song WHERE :id")
                .setParameter("id", key)
                .executeUpdate();
    }


    public void remove(int songId) {
        try {
            em.getTransaction().begin();
            em.createQuery("DELETE FROM Artist_Song a_s WHERE a_s.song.songId=:id")
                    .setParameter("id", songId)
                    .executeUpdate();
            em.getTransaction().commit();
        } catch (Exception e) {
            if(em.getTransaction().isActive()){
                em.getTransaction().rollback();
            }
            throw new RuntimeException(e);
        }
    }

    public void removeAllSong(int songId) {
        try {
            em.getTransaction().begin();
            em.createQuery("DELETE FROM Artist_Song a_s WHERE a_s.song.songId=:id")
                    .setParameter("id", songId)
                    .executeUpdate();
            em.remove(em.find(Song.class, songId));
            em.getTransaction().commit();
        } catch (Exception e) {
            if(em.getTransaction().isActive()){
                em.getTransaction().rollback();
            }
            throw new RuntimeException(e);
        }
    }

    @Override
    public Artist_Song find(ArtistSongId key) {
        return null;
    }

    @Override
    public List<Artist_Song> findAll() {
       return null;
    }

    public static void main(String[] args) {
        Artist_SongDao dap = new Artist_SongDao();
        dap.remove(76);
    }

}
