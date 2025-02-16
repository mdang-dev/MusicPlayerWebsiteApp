package com.server.controller;

import com.server.dao.SongDao;
import com.server.mapper.PlaysMapper;
import com.server.model.Song;
import com.server.utils.HttpUtil;
import com.server.utils.SendStatusUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet({
        "/api/update-plays"
})
public class UpdatePlaysController extends HttpServlet {

    SongDao dao = new SongDao();

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PlaysMapper mapper = HttpUtil.of(req.getReader()).toModel(PlaysMapper.class);
        try {
            Song song = dao.find(mapper.getSongId());
            song.setPlays(song.getPlays() + 1);
            dao.update(song);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusMess(resp, "Fail !", 400);
        }
    }
}
