package com.server.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.dao.UserDao;
import com.server.model.User;
import com.server.utils.EncryptPasswordUtil;
import com.server.utils.HttpUtil;
import com.server.utils.JpaUtilities;
import com.server.utils.SendStatusUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;


@WebServlet({
        "/api/users",
        "/api/users/id/*",
        "/api/admin"
})
public class UserController extends HttpServlet {

    EntityManager em = JpaUtilities.getEntityManager();

    UserDao dao = new UserDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json");
        ObjectMapper mapper = new ObjectMapper();
        if(req.getRequestURI().contains("/api/admin")) {
            mapper.writeValue(resp.getOutputStream(), dao.findAdminsAll());
        }
         else if(req.getRequestURI().contains("/api/users/id")) {
           int id = Integer.parseInt(req.getPathInfo().substring(1));
           mapper.writeValue(resp.getOutputStream(), dao.find(id));
        }
         else {
            mapper.writeValue(resp.getOutputStream(), dao.findUsersAll());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setCharacterEncoding("UTF-8");
        User model = HttpUtil.of(req.getReader()).toModel(User.class);
        try {
            User newUser = new User(
                                        model.getUserId(),
                                        model.getUserName(),
                                        model.getName(),
                                        model.getEmail(),
                                        EncryptPasswordUtil
                                                .encryptPassword(model.getPassword()),
                                  "/directories/images/avatar-new-account.jpg",
                                        model.isRole()
                                    );
           if(!checkEmail(model.getEmail()) && !checkUserName(model.getUserName())){
               dao.save(newUser);
               SendStatusUtil.sendStatusMess(resp, "Đăng kí thành công vui lòng tiến hành đăng nhập !", 200);
           }else if(checkEmail(model.getEmail())) {
               SendStatusUtil.sendStatusMess(resp, "Email đã được đăng kí !", 200);
           }else if(checkUserName(model.getUserName())){
               SendStatusUtil.sendStatusMess(resp, "User name đã tồn tại !", 200);
            }else {
               SendStatusUtil.sendStatusMess(resp, "User name và Email đã tồn tại !", 200);
           }
        }catch (Exception e) {
            System.out.println(e.getMessage());
            SendStatusUtil.sendStatusBad(resp);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        User model = HttpUtil.of(req.getReader()).toModel(User.class);
        model.setPassword(EncryptPasswordUtil.encryptPassword(model.getPassword()));
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
        resp.setCharacterEncoding("UTF-8");
        ObjectMapper mapper = new ObjectMapper();
        List<User> users = mapper.readValue(req.getReader(), new TypeReference<List<User>>() {});
        System.out.println(users);
        try {
            users.forEach(e -> {
                User user = new User(
                        e.getUserId(),
                        e.getUserName(),
                        e.getName(),
                        e.getEmail(),
                        e.getPassword(),
                        e.getAvatar(),
                        e.isRole()
                );
                dao.remove(user.getUserId());
            });
            SendStatusUtil.sendStatusOk(resp);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    boolean checkEmail(String email){
        try {
            User userEmail = em.createQuery("SELECT u FROM User u WHERE u.email=:email", User.class)
                                 .setParameter("email", email)
                                    .getSingleResult();
            return userEmail != null;
        } catch (NoResultException e) {
            return false;
        }
    }

    boolean checkUserName(String userName){
       try {
           User userUserName = em.createQuery("SELECT u FROM User u WHERE u.userName=:userName", User.class)
                                   .setParameter("userName", userName)
                                     .getSingleResult();
           return userUserName != null;
       } catch (NoResultException e) {
           return false;
       }
    }

}
