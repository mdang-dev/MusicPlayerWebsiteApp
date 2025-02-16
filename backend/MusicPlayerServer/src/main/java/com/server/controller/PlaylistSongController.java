package com.server.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.dao.Playlist_SongDAO;
import com.server.mapper.PlaylistSongMapper;
import com.server.model.PlaylistSongId;
import com.server.model.Playlist_Song;
import com.server.utils.HttpUtil;
import com.server.utils.SendStatusUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet({
     "/api/playlists-songs",
      "/api/playlists-songs/id/*"
})
public class PlaylistSongController extends HttpServlet {

    Playlist_SongDAO dao = new Playlist_SongDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json");
        ObjectMapper mapper = new ObjectMapper();
        if(req.getRequestURI().contains("/api/playlists-songs/id")){
            String id = req.getPathInfo().substring(1);
            mapper.writeValue(resp.getOutputStream(), dao.findSonginPlaylist(id).stream().map(Playlist_Song::getSong).collect(Collectors.toList()));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");
        PlaylistSongMapper mapper = HttpUtil.of(req.getReader()).toModel(PlaylistSongMapper.class);
        try {
            PlaylistSongId id = new PlaylistSongId(mapper.getPlaylistId(), mapper.getSongId());
            if(dao.find(id) != null ){
                SendStatusUtil.sendStatusMess(resp, "Bài hát đã tồn tại trong playlist !", 200);
            }else {
                dao.save(mapper.getPlaylistId(), mapper.getSongId());
                SendStatusUtil.sendStatusMess(resp, "Bài hát đã được thêm vào playlist !", 200);
            }
        }catch (Exception e) {
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusMess(resp, "Fail !", 400);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json");
        PlaylistSongMapper mapper = HttpUtil.of(req.getReader()).toModel(PlaylistSongMapper.class);
        try {
            dao.remove(mapper.getPlaylistId(), mapper.getSongId());
            SendStatusUtil.sendStatusMess(resp, "Bài hát đã được xóa khỏi playlist !", 200);
        }catch (Exception e) {
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusMess(resp, "Fail !", 400);
        }
    }
}
