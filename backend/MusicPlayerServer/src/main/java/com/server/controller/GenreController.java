package com.server.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.dao.GenreDao;
import com.server.model.Genre;
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
        "/api/genres",
        "/api/genres/id/*"
        })
public class GenreController extends HttpServlet {

    GenreDao dao = new GenreDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        if(req.getRequestURI().contains("/api/genres/id")) {
            int id = Integer.parseInt(req.getPathInfo().substring(1));
            mapper.writeValue(resp.getOutputStream(), dao.find(id));
            SendStatusUtil.sendStatusOk(resp);
        }else {
            List<Genre> list = dao.findAll();
            mapper.writeValue(resp.getOutputStream(), list);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        Genre model = HttpUtil.of(req.getReader()).toModel(Genre.class);
        try {
            dao.save(model);
            SendStatusUtil.sendStatusOk(resp);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusBad(resp);
        }

    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        Genre model = HttpUtil.of(req.getReader()).toModel(Genre.class);
        try {
            dao.update(model);
            SendStatusUtil.sendStatusOk(resp);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusBad(resp);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        List<Genre> genres = new ObjectMapper().readValue(req.getReader(), new TypeReference<List<Genre>>() {});
        try {
            genres.forEach(e -> dao.remove(e.getGenreId()));
            SendStatusUtil.sendStatusOk(resp);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusBad(resp);
        }
    }
    
}
