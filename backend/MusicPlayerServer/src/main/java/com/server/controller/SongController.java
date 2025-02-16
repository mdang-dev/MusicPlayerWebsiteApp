package com.server.controller;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.dao.ArtistDao;
import com.server.dao.Artist_SongDao;
import com.server.dao.GenreDao;
import com.server.dao.SongDao;
import com.server.mapper.SongMapper;
import com.server.model.*;
import com.server.utils.JpaUtilities;
import com.server.utils.SendStatusUtil;
import jakarta.persistence.EntityManager;
import org.hibernate.annotations.Array;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@MultipartConfig()
@WebServlet({
        "/api/songs",
        "/api/songs/id/*",
        "/api/songs/top-plays",
        "/api/songs/top-liked"
})
public class SongController extends HttpServlet {

    EntityManager em = JpaUtilities.getEntityManager();
    SongDao daoSong = new SongDao();
    Artist_SongDao daoArtistSong = new Artist_SongDao();
    private final String DIR_AUDIO = "/directories/audio/";
    private final String DIR_IMAGES = "/directories/images/";
    List<Song> songs  = daoSong.findAll();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json");
        ObjectMapper mapper = new ObjectMapper();
        if(req.getRequestURI().contains("/api/songs/id/")){
           int id = Integer.parseInt(req.getPathInfo().substring(1));
           mapper.writeValue(resp.getOutputStream(), daoSong.find(id));
       } else if(req.getRequestURI().contains("/api/songs/top-plays")) {
            mapper.writeValue(resp.getOutputStream(), daoSong.findTop10SongPlays());
        } else if (req.getRequestURI().contains("/api/songs/top-liked")) {
            List<Object[]> list = daoSong.findTop10SongLiked();
            List<Map<String, Object>> songData = new ArrayList<>();
            list.forEach(e -> {
                Map<String, Object> map = new HashMap<>();
                map.put("songId", e[0]);
                map.put("songName", e[1]);
                map.put("likedCount", e[2]);
                songData.add(map);
            });
            mapper.writeValue(resp.getOutputStream(), songData);
        }else  {
            List<Song> list = daoSong.findAll();
            Collections.reverse(list);
            mapper.writeValue(resp.getOutputStream(), list);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json");
        try {

           ObjectMapper mapper = new ObjectMapper();
           Song newSong = new Song();
           String jsonData = req.getParameter("jsonData");
           SongMapper songMapper = mapper.readValue(jsonData, SongMapper.class);
           Part coverPhoto = req.getPart("coverPhoto");
           Part filePath = req.getPart("filePath");

           newSong.setSongId(songMapper.getSongId());
           newSong.setSongName(songMapper.getSongName());
           newSong.setGenre(new GenreDao().find(songMapper.getGenre()));
           newSong.setReleaseDate(songMapper.getReleaseDate());
           newSong.setDuration(songMapper.getDuration());

           if(coverPhoto != null && coverPhoto.getSize() > 0) {
               String pathOfCoverPhoto = DIR_IMAGES + coverPhoto.getSubmittedFileName();
               String realPath = getServletContext().getRealPath(pathOfCoverPhoto);
               createDirectory(realPath);
               coverPhoto.write(realPath);
               newSong.setCoverPhoto(pathOfCoverPhoto);
           }
           if(filePath != null && filePath.getSize() > 0) {
               String pathOfFilePath = DIR_AUDIO + filePath.getSubmittedFileName();
               String realPath = getServletContext().getRealPath(pathOfFilePath);
               createDirectory(realPath);
               filePath.write(realPath);
               newSong.setFilePath(pathOfFilePath);
           }

           int songId =  daoSong.saveAndReturn(newSong);
           Arrays.stream(songMapper.getArtists()).forEach(artistId -> daoArtistSong.save(artistId, songId));
           songs = daoSong.findAll();
           SendStatusUtil.sendStatusOk(resp);
       } catch (Exception e) {
           SendStatusUtil.sendStatusBad(resp);
       }

    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json");
        try {

            ObjectMapper mapper = new ObjectMapper();
            String jsonData = req.getParameter("jsonData");
            Part coverPhoto = req.getPart("coverPhoto");
            Part filePath = req.getPart("filePath");
            SongMapper songMapper = mapper.readValue(jsonData, SongMapper.class);
            Song song = daoSong.find(songMapper.getSongId());
            song.setSongName(songMapper.getSongName());
            song.setGenre(new GenreDao().find(songMapper.getGenre()));
            song.setReleaseDate(songMapper.getReleaseDate());
            song.setDuration(songMapper.getDuration());

            if(coverPhoto != null && coverPhoto.getSize() > 0) {
                String pathOfCoverPhoto = DIR_IMAGES + coverPhoto.getSubmittedFileName();
                String realPath = getServletContext().getRealPath(pathOfCoverPhoto);
                createDirectory(realPath);
                coverPhoto.write(realPath);
                song.setCoverPhoto(pathOfCoverPhoto);
            }

            if(filePath != null && filePath.getSize() > 0) {
                String pathOfFilePath = DIR_AUDIO + filePath.getSubmittedFileName();
                String realPath = getServletContext().getRealPath(pathOfFilePath);
                createDirectory(realPath);
                filePath.write(realPath);
                song.setFilePath(pathOfFilePath);
            }

            daoArtistSong.remove(song.getSongId());
            Arrays.stream(songMapper.getArtists())
                    .forEach(artistId -> daoArtistSong.save(artistId, song.getSongId()));
            daoSong.update(song);
            songs = daoSong.findAll();
            SendStatusUtil.sendStatusOk(resp);
        } catch (Exception e) {
            SendStatusUtil.sendStatusBad(resp);
            System.out.println(e);
        }

    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        Integer[] songids = new ObjectMapper().readValue(req.getReader(), new TypeReference<Integer[]>() {});
        try {
            Arrays.stream(songids).forEach(e -> {
                daoArtistSong.removeAllSong(e);
            });
            songs = daoSong.findAll();
            SendStatusUtil.sendStatusOk(resp);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusBad(resp);
        }
    }

    void createDirectory(String dirPath) throws IOException {
        if(!Files.exists(Path.of(dirPath))) Files.createDirectories(Path.of(dirPath));
    }


}
