package com.server.dao;

import com.server.model.Playlist;
import com.server.model.PlaylistSongId;
import com.server.model.Playlist_Song;
import com.server.model.Song;
import com.server.utils.JpaUtilities;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class Playlist_SongDAO implements ISuperDao<Playlist_Song, PlaylistSongId>{

    EntityManager em = JpaUtilities.getEntityManager();

    @Override
    public void save(Playlist_Song model) {
        try {
            em.getTransaction().begin();
            em.persist(model);
            em.getTransaction().commit();
        }catch (Exception e){
            em.getTransaction().rollback();
        }
    }

    public void save(String playlistId, int songId) {
        try {
            em.getTransaction().begin();
            Playlist playlist = em.find(Playlist.class, playlistId);
            Song song = em.find(Song.class, songId);
            if (playlist == null || song == null) {
                throw new IllegalArgumentException("Playlist or Song not found in the database.");
            }
            PlaylistSongId id = new PlaylistSongId(playlist.getPlaylistId(), song.getSongId());
            Playlist_Song model = new Playlist_Song(id, playlist, song, getPosition(playlist.getPlaylistId()));
            em.persist(model);
            em.getTransaction().commit();
        }catch (Exception e){
            em.getTransaction().rollback();
        }
    }

    @Override
    public void update(Playlist_Song model) {
        try {
            em.getTransaction().begin();
            em.merge(model);
            em.getTransaction().commit();
        }catch (Exception e){
            em.getTransaction().rollback();
        }
    }

    @Override
    public void remove(PlaylistSongId id) {
        em.createQuery("DELETE FROM Playlist_Song p_s WHERE p_s.id=:id")
                .setParameter("id", id)
                  .executeUpdate();
    }

    public void remove(String playlistId, int songId) {
       try {
           em.getTransaction().begin();
           Playlist playlist = em.find(Playlist.class, playlistId);
           Song song = em.find(Song.class, songId);
           if(playlist == null || song == null) {
               throw new IllegalArgumentException("Playlist or Song not found in the database.");
           }
           PlaylistSongId id  = new PlaylistSongId(playlist.getPlaylistId(), song.getSongId());
           em.remove(find(id));
           em.getTransaction().commit();
       }catch (Exception e){
           System.out.println(e.getMessage());
           em.getTransaction().rollback();
       }
    }

    @Override
    public Playlist_Song find(PlaylistSongId key) {
        return em.find(Playlist_Song.class, key);
    }

    @Override
    public List<Playlist_Song> findAll() {
        TypedQuery<Playlist_Song> query = em.createQuery("SELECT p_s FROM Playlist_Song p_s", Playlist_Song.class);
        return query.getResultList();
    }

    public List<Playlist_Song> findSonginPlaylist(String playlistId){
        em.clear();
       TypedQuery<Playlist_Song> query = em.createQuery("SELECT p_s FROM Playlist_Song p_s WHERE p_s.id.playlistId=:id ORDER BY p_s.positionInPlaylist DESC", Playlist_Song.class)
                                         .setParameter("id", playlistId);
       return query.getResultList();
    }

     int getPosition(String id) {
             Integer position = em.createQuery("SELECT MAX(p_s.positionInPlaylist) FROM Playlist_Song p_s WHERE p_s.id.playlistId=:id", Integer.class)
                     .setParameter("id", id)
                     .getSingleResult();
             return position == null ? 1 : position + 1;
     }

}
