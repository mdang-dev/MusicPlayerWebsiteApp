package com.server.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.dao.ArtistDao;
import com.server.model.Artist;
import com.server.utils.HttpUtil;
import com.server.utils.SendStatusUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet({
        "/api/artists",
        "/api/artists/id/*"
})
public class ArtistController extends HttpServlet {

    ArtistDao dao = new ArtistDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
       ObjectMapper mapper = new ObjectMapper();
       if (req.getRequestURI().contains("/api/artists/id")) {
            int id = Integer.parseInt(req.getPathInfo().substring(1));
            mapper.writeValue(resp.getOutputStream(), dao.find(id));
       } else {
           List<Artist> list = dao.findAll();
           mapper.writeValue(resp.getOutputStream(), list);
       }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        Artist model = HttpUtil.of(req.getReader()).toModel(Artist.class);
        try {
            dao.save(model);
            SendStatusUtil.sendStatusOk(resp);
        }catch (Exception e){
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusBad(resp);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        Artist model = HttpUtil.of(req.getReader()).toModel(Artist.class);
        try {
            dao.update(model);
            SendStatusUtil.sendStatusOk(resp);
        }catch (Exception e){
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusBad(resp);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        ObjectMapper mapper = new ObjectMapper();
        List<Artist> artists = mapper.readValue(req.getReader(), new TypeReference<List<Artist>>() {});
        try {
            artists.forEach(e -> dao.remove(e.getArtistId()));
            SendStatusUtil.sendStatusOk(resp);
        }catch (Exception e){
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusBad(resp);
        }
    }

}
