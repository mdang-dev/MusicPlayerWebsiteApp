package com.server.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.dao.PlaylistDao;
import com.server.mapper.PlaylistMapper;
import com.server.model.Playlist;
import com.server.utils.HttpUtil;
import com.server.utils.SendStatusUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

@WebServlet({
        "/api/playlists",
        "/api/playlists/user-id/*"
})
public class PlaylistController extends HttpServlet {

    PlaylistDao dao = new PlaylistDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        if(req.getRequestURI().contains("/api/playlists/user-id")){
            int id = Integer.parseInt(req.getPathInfo().substring(1));
            List<Playlist> list = dao.findPlaylistOfUser(id);
            Collections.reverse(list);
            mapper.writeValue(resp.getOutputStream(), list);
        }
        else
            mapper.writeValue(resp.getOutputStream(), dao.findAll());
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setCharacterEncoding("UTF-8");
        PlaylistMapper mapper = HttpUtil.of(req.getReader()).toModel(PlaylistMapper.class);
        try {
            dao.save(mapper);
            SendStatusUtil.sendStatusMess(resp, "Save successfully !", 200);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusMess(resp, "Fail !", 400);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setCharacterEncoding("UTF-8");
        PlaylistMapper mapper = HttpUtil.of(req.getReader()).toModel(PlaylistMapper.class);
        try {
            dao.update(mapper);
            SendStatusUtil.sendStatusMess(resp, "Update successfully !", 200);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusMess(resp, "Fail !", 400);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        PlaylistMapper mapper = HttpUtil.of(req.getReader()).toModel(PlaylistMapper.class);
        try {
            dao.remove(mapper.getPlaylistId());
            SendStatusUtil.sendStatusMess(resp, "Delete successfully !", 200);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusMess(resp, "Fail !", 400);
        }
    }
}
