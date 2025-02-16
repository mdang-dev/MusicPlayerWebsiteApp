package com.server.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.dao.Liked_SongDao;
import com.server.dao.UserDao;
import com.server.mapper.LikedSongMapper;
import com.server.model.LikedSongId;
import com.server.model.Liked_Song;
import com.server.model.Song;
import com.server.utils.HttpUtil;
import com.server.utils.SendStatusUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet({
        "/api/liked-songs",
        "/api/liked-songs/user-id/*"
})
public class LikedSongController extends HttpServlet  {

    Liked_SongDao dao = new Liked_SongDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json");
        ObjectMapper mapper = new ObjectMapper();
        UserDao userDao = new UserDao();
        if(req.getRequestURI().contains("/api/liked-songs/user-id")){
            int id = Integer.parseInt(req.getPathInfo().substring(1));
            List<Song> list = userDao.find(id)
                             .getLikedSongs()
                             .stream()
                             .sorted(Comparator
                                     .comparingInt(Liked_Song::getPositionInListLiked))
                             .map(Liked_Song::getSong)
                             .collect(Collectors.toList());
            Collections.reverse(list);
            mapper.writeValue(resp.getOutputStream(), list);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setCharacterEncoding("UTF-8");
        LikedSongMapper mapper = HttpUtil.of(req.getReader()).toModel(LikedSongMapper.class);
        try {
            LikedSongId id = new LikedSongId(mapper.getUserId(), mapper.getSongId());
            Liked_Song likedSong = dao.find(id);
            if(likedSong != null) {
                SendStatusUtil.sendStatusMess(resp, "Bài hát đã tồn tại trong yêu thích !", 200);
            }else {
                dao.save(mapper.getUserId(), mapper.getSongId());
                SendStatusUtil.sendStatusMess(resp, "Bài hát đã được thêm vào yêu thích !", 200);
            }
        }catch (Exception e){
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusMess(resp, "Fail !", 400);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setCharacterEncoding("UTF-8");
        LikedSongMapper mapper = HttpUtil.of(req.getReader()).toModel(LikedSongMapper.class);
        try {
            dao.remove(mapper.getUserId(), mapper.getSongId());
            SendStatusUtil.sendStatusMess(resp, "Bài hát đã được xóa khỏi yêu thích !", 200);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusMess(resp, "Fail !", 400);
        }
    }
}
