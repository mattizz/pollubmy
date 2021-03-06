package pl.pollubmy.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import pl.pollubmy.server.entity.DatabaseFile;
import pl.pollubmy.server.entity.FileInformation;
import pl.pollubmy.server.entity.User;
import pl.pollubmy.server.entity.dto.FileInformationDTO;
import pl.pollubmy.server.entity.dto.FileInformationDTOConverter;
import pl.pollubmy.server.exceptions.FileStorageException;
import pl.pollubmy.server.exceptions.UserNotFoundException;
import pl.pollubmy.server.repository.DatabaseFileRepository;
import pl.pollubmy.server.repository.StoredFileRepository;
import pl.pollubmy.server.repository.UserRepository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DatabaseFileStorageService {

    private final DatabaseFileRepository databaseFileRepository;
    private final StoredFileRepository storedFileRepository;
    private final UserRepository userRepository;


    @Autowired
    public DatabaseFileStorageService(DatabaseFileRepository databaseFileRepository, StoredFileRepository storedFileRepository, UserRepository userRepository) {
        this.databaseFileRepository = databaseFileRepository;
        this.storedFileRepository = storedFileRepository;
        this.userRepository = userRepository;
    }

    public void storeFile(MultipartFile file, String userLogin, FileInformation fileInformationBody) {

        DatabaseFile savedFileInDB;
        User user = checkIfUserExist(userLogin);

        String fileName = StringUtils.cleanPath(checkIfFileNameIsEmpty(file));

        try {
            ifFileContainsInvalidCharacter(fileName);
            savedFileInDB = saveInDatabase(fileName, file);
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }

        fileInformationBody.setDatabaseFileIdFk(savedFileInDB);
        fileInformationBody.getDatabaseFileIdFk().setFileInformation(fileInformationBody);
        fileInformationBody.setUserIdFk(user);
        fileInformationBody.getUserIdFk().getFilesInformation().add(fileInformationBody);
        this.storedFileRepository.save(fileInformationBody);
    }


    private String checkIfFileNameIsEmpty(MultipartFile file) {
        if (file.getOriginalFilename() == null) {
            throw new FileStorageException("Empty name of file");
        }

        return file.getOriginalFilename();
    }

    private DatabaseFile saveInDatabase(String fileName, MultipartFile fileToSave) throws IOException {
        DatabaseFile dbFile = new DatabaseFile(fileName, fileToSave.getContentType(), fileToSave.getBytes());
        return this.databaseFileRepository.save(dbFile);
    }

    private void ifFileContainsInvalidCharacter(String fileName) {
        if (fileName.contains("..")) {
            throw new FileStorageException("Invalid characters in filename");
        }
    }

    private User checkIfUserExist(String userLogin) throws UserNotFoundException {
        Optional<User> user = this.userRepository.findByLogin(userLogin);
        if (!user.isPresent()) throw new UserNotFoundException("User not found");
        return user.get();
    }

    public void deleteFile(String userLogin, String fileInformationId) {
        User user = checkIfUserExist(userLogin);
        FileInformation fileInformation = checkIfStoredFileExist(fileInformationId);
        checkIfFileBelongToUser(user, fileInformation);
        this.storedFileRepository.delete(fileInformation);
    }

    private void checkIfFileBelongToUser(User user, FileInformation fileInformation) {
        if (!(fileInformation.getUserIdFk().getUserId().equals(user.getUserId()))) {
            throw new FileStorageException("This file doesn't belong to this user");
        }
    }

    private FileInformation checkIfStoredFileExist(String fileInformationId) {
        Optional<FileInformation> storedFile = this.storedFileRepository.findById(fileInformationId);

        if (!storedFile.isPresent()) {
            throw new FileStorageException("File not found");
        }

        return storedFile.get();
    }

    public List<FileInformationDTO> getFilesInformation(String userLogin) {
        User user = checkIfUserExist(userLogin);

        List<FileInformation> fileInformationList = this.storedFileRepository.findAll();
        checkIfFilesExistInDB(fileInformationList);

        List<FileInformationDTO> fileInformationDTOList = new ArrayList<>();

        for (FileInformation fileInformation : fileInformationList) {
            FileInformationDTO fileInformationDTO = FileInformationDTOConverter.toDto(fileInformation, user);
            fileInformationDTOList.add(fileInformationDTO);
        }

        return fileInformationDTOList;
    }

    private void checkIfFilesExistInDB(List<FileInformation> fileInformationList) {
        if (fileInformationList.isEmpty()) {
            throw new FileStorageException("No files in database");
        }
    }

    public List<FileInformationDTO> getAllMyFiles(String userLogin) {
        User user = checkIfUserExist(userLogin);
        List<FileInformation> userFiles = user.getFilesInformation();
        checkIfUserHasFiles(userFiles);
        return convertFileInformationToDTO(userFiles, user);
    }

    private List<FileInformationDTO> convertFileInformationToDTO(List<FileInformation> userFiles, User user) {
        List<FileInformationDTO> fileInformationDTOList = new ArrayList<>();

        for (FileInformation fileInformation : userFiles) {
            FileInformationDTO file = FileInformationDTOConverter.toDto(fileInformation, user);
            fileInformationDTOList.add(file);
        }

        return fileInformationDTOList;
    }

    private void checkIfUserHasFiles(List<FileInformation> filesInformation) {
        if (filesInformation.isEmpty()) {
            throw new FileStorageException("User doesn't have uploaded files");
        }
    }
}
