package pl.pollubmy.server.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.pollubmy.server.entity.User;
import pl.pollubmy.server.exceptions.UserNotFoundException;
import pl.pollubmy.server.repository.UserRepository;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String loginOrEmail) throws UsernameNotFoundException {

        Optional<User> userWithEmailOrLoginExist = this.userRepository.findByEmailPollubOrLogin(loginOrEmail, loginOrEmail);

        if (userWithEmailOrLoginExist.isPresent()) {
            User foundUser = userWithEmailOrLoginExist.get();
            return new org.springframework.security.core.userdetails.User(foundUser.getLogin(), foundUser.getPassword(), AuthorityUtils.createAuthorityList(foundUser.getUserRole().toString()));
        } else {
            throw new UserNotFoundException("User with this email or login doesn't exist");
        }
    }
}
