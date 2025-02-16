package com.server.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.dao.UserDao;
import com.server.mapper.InfoMapper;
import com.server.model.User;
import com.server.utils.SendStatusUtil;

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
@MultipartConfig()
@WebServlet({
        "/api/info"
})
public class UpdateInfoController extends HttpServlet {

    UserDao dao = new UserDao();
    private final String DIR_IMAGES = "/directories/images/";

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setCharacterEncoding("UTF-8");
        try {
            String jsonData = req.getParameter("jsonData");
            InfoMapper mapper = new ObjectMapper().readValue(jsonData, InfoMapper.class);
            User user = dao.find(mapper.getUserId());
            if(user != null) {
                Part avatar = req.getPart("avatar");
                if (avatar != null && avatar.getSize() > 0) {
                    String pathOfAvatar = DIR_IMAGES + avatar.getSubmittedFileName();
                    String realPath = getServletContext().getRealPath(pathOfAvatar);
                    createDirectory(realPath);
                    avatar.write(realPath);
                    user.setAvatar(pathOfAvatar);
                }
                user.setUserName(mapper.getUserName());
                user.setName(mapper.getName());
                dao.update(user);
                SendStatusUtil.sendStatusMess(resp, "Cập nhật thông tin thành công !", 200);
            }
        } catch (Exception e) {
            SendStatusUtil.sendStatusMess(resp, "Fail !", 400);
            throw new RuntimeException(e);
        }
    }
    void createDirectory(String dirPath) throws IOException {
        if(!Files.exists(Path.of(dirPath))) Files.createDirectories(Path.of(dirPath));
    }
}
