package com.daw.web.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtUtils {

    @Autowired
    private JwtConfig config;

    public String generateAccessToken(UserDetails userDetails) {
        return JWT.create()
                .withSubject(userDetails.getUsername())
                .withClaim("roles", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                .withIssuedAt(new Date())
                .withIssuer(config.getIssuer())
                .withExpiresAt(new Date(System.currentTimeMillis() + config.getAccessTokenExpires()))
                .sign(Algorithm.HMAC256(config.getSecret()));
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return JWT.create()
                .withSubject(userDetails.getUsername())
                .withClaim("roles", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                .withClaim("type", "refresh")
                .withIssuedAt(new Date())
                .withIssuer(config.getIssuer())
                .withExpiresAt(new Date(System.currentTimeMillis() + config.getRefreshTokenExpires()))
                .sign(Algorithm.HMAC256(config.getSecret()));
    }

    public String extractUsername(String token) {
        return JWT.require(Algorithm.HMAC256(config.getSecret()))
                .build()
                .verify(token)
                .getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername());
    }

    public String generateAccessToken(String token){
        DecodedJWT jwt = JWT.decode(token);
        return JWT.create()
                .withSubject(jwt.getSubject())
                .withClaim("roles", jwt.getClaim("roles").asList(String.class))
                .withIssuedAt(new Date())
                .withIssuer(config.getIssuer())
                .withExpiresAt(new Date(System.currentTimeMillis() + config.getAccessTokenExpires()))
                .sign(Algorithm.HMAC256(config.getSecret()));
    }

    public String generateRefreshToken(String token) {
        DecodedJWT jwt = JWT.decode(token);
        return JWT.create()
                .withSubject(jwt.getSubject())
                .withClaim("roles", jwt.getClaim("roles").asList(String.class))
                .withClaim("type", "refresh")
                .withIssuedAt(new Date())
                .withIssuer(config.getIssuer())
                .withExpiresAt(new Date(System.currentTimeMillis() + config.getAccessTokenExpires()))
                .sign(Algorithm.HMAC256(config.getSecret()));
    }

}
