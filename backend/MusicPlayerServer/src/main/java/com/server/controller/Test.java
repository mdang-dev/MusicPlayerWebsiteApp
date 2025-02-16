package com.server.controller;

import com.server.dao.*;

import com.server.model.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;


import java.text.ParseException;



public class Test {

    public static void main (String[] args) throws ParseException {

        EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPA");
        EntityManager em = emf.createEntityManager();

      try {
         Song song = new SongDao().find(44);
         Artist artist = new ArtistDao().find(31);
         ArtistSongId id = new ArtistSongId(artist.getArtistId(), song.getSongId());
         new Artist_SongDao().save(artist.getArtistId(), song.getSongId());
      } catch (Exception e) {
          throw new RuntimeException(e);
      }

    }
}
