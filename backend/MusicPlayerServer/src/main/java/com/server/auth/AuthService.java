package com.server.auth;

import com.google.gson.JsonObject;
import com.server.dao.UserDao;
import com.server.model.User;
import com.server.utils.HttpUtil;
import com.server.utils.JpaUtilities;
import com.server.utils.JwtUtil;
import com.server.utils.SendStatusUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@WebServlet(
        "/api/auth"
)
public class AuthService extends HttpServlet {

    EntityManager em = JpaUtilities.getEntityManager();
    UserDao dao = new UserDao();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    static class AuthModel {
        String email;
        String password;
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        AuthModel model = HttpUtil.of(req.getReader()).toModel(AuthModel.class);
        String accessToken = null;
        String refreshToken = null;
        User user = dao.checkValidLogin(dao.checkUser(model.getEmail()),
                                                            model.getPassword());
       if(user != null){
           Map<String, Object> userInfo = new HashMap<>();
           userInfo.put("userId", user.getUserId());
           userInfo.put("userName", user.getUserName());
           userInfo.put("name", user.getName());
           userInfo.put("email", user.getEmail());
           userInfo.put("avatar", user.getAvatar());
           userInfo.put("role", user.isRole());
           accessToken = JwtUtil.generateAccessToken(user.getEmail(), userInfo);
           refreshToken = JwtUtil.generateRefreshToken(user.getEmail());
           JsonObject jsonObject = new JsonObject();
           jsonObject.addProperty("accessToken", accessToken);
           jsonObject.addProperty("refreshToken", refreshToken);
           resp.getWriter().print(jsonObject);
           resp.setStatus(200);
       }else {
           SendStatusUtil.sendStatusMess(resp, "Sai email hoặc mật khẩu !", 200);
       }

    }
}
