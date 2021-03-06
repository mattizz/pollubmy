package pl.pollubmy.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
public class User {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid")
    @Column(columnDefinition = "CHAR(32)")
    private String userId;

    @JsonManagedReference
    @OneToMany(mappedBy = "userIdFK", cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<UserRole> userRole;

    @JsonManagedReference
    @OneToOne(mappedBy = "userIdFK", cascade = CascadeType.ALL)
    private UserAddress userAddress = new UserAddress();

    @JsonManagedReference
    @OneToOne(mappedBy = "userIdFK", cascade = CascadeType.ALL)
    private UserDetails userDetails = new UserDetails();

    @JsonManagedReference
    @OneToMany(mappedBy = "userIdFK", cascade = CascadeType.ALL)
    private List<PrivateLessonOffer> privateLessonOffers = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "userIdFk", cascade = CascadeType.ALL)
    private List<ForumPost> forumPosts = new ArrayList<>();

    @JsonManagedReference(value = "user-comment")
    @OneToMany(mappedBy = "userIdFk", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "userIdFk")
    @JsonIgnore
    private List<ForumPostRating> forumPostRatings = new ArrayList<>();

    @OneToMany(mappedBy = "userIdFk")
    @JsonIgnore
    private List<CommentRating> commentRatings = new ArrayList<>();

    @OneToMany(mappedBy = "userIdFk", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<FileInformation> filesInformation = new ArrayList<>();

    @OneToMany(mappedBy = "userIdFk", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<HelpInStudyOffer> helpInStudyOffers = new ArrayList<>();

    @NotNull
    @NotEmpty
    private String firstName;

    @NotNull
    @NotEmpty
    private String lastName;

    @NotNull
    @NotEmpty
    @Column(unique = true)
    @Size(min = 3)
    private String login;

    @NotNull
    @NotEmpty
    @Email
    @Column(unique = true)
    private String emailPollub;

    @NotNull
    @NotEmpty
    private String password;

    private boolean isActive = true;


    public User() {
        this.getUserDetails().setUserIdFK(this);
        this.getUserAddress().setUserIdFK(this);
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<UserRole> getUserRole() {
        return userRole;
    }

    public void setUserRole(List<UserRole> userRole) {
        this.userRole = userRole;
    }

    public UserAddress getUserAddress() {
        return userAddress;
    }

    public void setUserAddress(UserAddress userAddress) {
        this.userAddress = userAddress;
    }

    public UserDetails getUserDetails() {
        return userDetails;
    }

    public void setUserDetails(UserDetails userDetails) {
        this.userDetails = userDetails;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getEmailPollub() {
        return emailPollub;
    }

    public void setEmailPollub(String emailPollub) {
        this.emailPollub = emailPollub;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @JsonProperty
    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    @JsonIgnore
    public List<PrivateLessonOffer> getPrivateLessonOffers() {
        return privateLessonOffers;
    }

    public void setPrivateLessonOffers(List<PrivateLessonOffer> privateLessonOffers) {
        this.privateLessonOffers = privateLessonOffers;
    }

    @JsonIgnore
    public List<ForumPost> getForumPosts() {
        return forumPosts;
    }

    public void setForumPosts(List<ForumPost> forumPosts) {
        this.forumPosts = forumPosts;
    }

    @JsonIgnore
    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<ForumPostRating> getForumPostRatings() {
        return forumPostRatings;
    }

    public void setForumPostRatings(List<ForumPostRating> forumPostRatings) {
        this.forumPostRatings = forumPostRatings;
    }

    public List<CommentRating> getCommentRatings() {
        return commentRatings;
    }

    public void setCommentRatings(List<CommentRating> commentRatings) {
        this.commentRatings = commentRatings;
    }

    public List<FileInformation> getFilesInformation() {
        return filesInformation;
    }

    public void setFilesInformation(List<FileInformation> filesInformation) {
        this.filesInformation = filesInformation;
    }

    public List<HelpInStudyOffer> getHelpInStudyOffers() {
        return helpInStudyOffers;
    }

    public void setHelpInStudyOffers(List<HelpInStudyOffer> helpInStudyOffers) {
        this.helpInStudyOffers = helpInStudyOffers;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId='" + userId + '\'' +
                ", userRole=" + userRole +
                ", userAddress=" + userAddress +
                ", userDetails=" + userDetails +
                ", privateLessonOffers=" + privateLessonOffers +
                ", forumPosts=" + forumPosts +
                ", comments=" + comments +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", login='" + login + '\'' +
                ", emailPollub='" + emailPollub + '\'' +
                ", password='" + password + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}
