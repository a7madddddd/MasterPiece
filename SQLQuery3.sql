create database MASTER_PEICE
use MASTER_PEICE


CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    FirstName VARCHAR(50),
	ProfileImage VARCHAR(MAX),
    LastName VARCHAR(50),
    Phone VARCHAR(13),
    UserRole VARCHAR(20) NOT NULL DEFAULT 'user'
);

CREATE TABLE Services (
    ServiceID INT IDENTITY(1,1) PRIMARY KEY,
    ServiceName VARCHAR(100) NOT NULL,
    Description TEXT,
    Image VARCHAR(255),
    Price DECIMAL(10,2),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE ContactMessages (
    MessageID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Subject VARCHAR(200),
    Message TEXT NOT NULL,
    SubmittedAt DATETIME DEFAULT GETDATE(),
    Status VARCHAR(20) DEFAULT 'new'
);

CREATE TABLE JoinRequests (
    RequestID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Phone VARCHAR(20),
    Message TEXT,
    ServiceImage VARCHAR(255),
    Status VARCHAR(20) DEFAULT 'pending'
);

CREATE TABLE Profiles (
    ProfileID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT UNIQUE,
    Location VARCHAR(100),
    Email VARCHAR(255),
    Phone VARCHAR(15),
    ProfilePicture VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Payments (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT,
    Amount DECIMAL(10,2) NOT NULL,
    PaymentDate DATETIME DEFAULT GETDATE(),
    PaymentStatus VARCHAR(20) DEFAULT 'pending',
    PaymentMethod VARCHAR(50),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

drop TABLE Offers (
    OfferID INT IDENTITY(1,1) PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Description TEXT,
    StartDate DATE,
    EndDate DATE,
    DiscountPercentage DECIMAL(5,2),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE AdminChats (
    ChatID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT,
    AdminID INT,
    Message TEXT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Bookings (
    BookingID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT,
    ServiceID INT,
    BookingDate DATE,
    NumberOfPeople INT,
    TotalAmount DECIMAL(10,2),
    Status VARCHAR(20) DEFAULT 'pending',
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ServiceID) REFERENCES Services(ServiceID)
);

CREATE TABLE Reviews (
    ReviewID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT,
    ServiceID INT,
    Rating INT,
    Comment TEXT,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ServiceID) REFERENCES Services(ServiceID)
);

CREATE TABLE Reviews (
    ReviewID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT,
    ServiceID INT,
    Rating INT,
    Comment TEXT,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ServiceID) REFERENCES Services(ServiceID)
);



DROP TABLE IF EXISTS ServicesGallery;

CREATE TABLE ServicesGallery (
    GalleryId INT PRIMARY KEY Identity,
    ServiceID INT,
    image1 VARCHAR(MAX),
    image2 VARCHAR(MAX),
    image3 VARCHAR(MAX),
    image4 VARCHAR(MAX),
    image5 VARCHAR(MAX),
    image6 VARCHAR(MAX),
    
    FOREIGN KEY (ServiceID) REFERENCES Services(ServiceID)
);


--/////////////////////////////////////////////////////////////







CREATE TABLE tourism_statistics (
    year INT,
    clients INT,
    clients_change_percentage DECIMAL(5,2),
    returning_clients INT,
    returning_clients_change_percentage DECIMAL(5,2),
    reservations INT,
    reservations_change_percentage DECIMAL(5,2),
    items INT,
    items_change_percentage DECIMAL(5,2),
    awwards INT,
    days VARCHAR(100),
    duration VARCHAR(100),
    PRIMARY KEY (year, days)  -- Composite primary key
);



ALTER TABLE tourism_statistics
ADD awwards INT;

ALTER TABLE tourism_statistics 
ADD days VARCHAR(50);

ALTER TABLE tourism_statistics 
ADD days VARCHAR(50);

ALTER TABLE tourism_statistics 
ADD duration VARCHAR(50);






ALTER TABLE ContactMessages
ADD UserID INT;

ALTER TABLE ContactMessages
ADD CONSTRAINT FK_UserID FOREIGN KEY (UserID) REFERENCES Users(UserID);



ALTER TABLE Users
ADD Password INT;







ALTER TABLE JoinRequests
ALTER COLUMN ServiceImage VARCHAR(MAX);









-- Drop the existing Offers table
DROP TABLE IF EXISTS Offers;

-- Create the new Offers table with additional columns
CREATE TABLE Offers (
    OfferID INT IDENTITY(1,1) PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Description TEXT,
    StartDate VARCHAR(50),
    EndDate VARCHAR(50),
    DiscountPercentage DECIMAL(5,2),
    IsActive BIT DEFAULT 1,
    CreatedAt VARCHAR(50),
    PricePerNight DECIMAL(10,2) NOT NULL DEFAULT 0,
    Rating DECIMAL(3,1),
    ReviewCount INT,
    AccommodationType VARCHAR(50),
    ImageURL VARCHAR(MAX),
    Amenities VARCHAR(MAX)
);


ALTER TABLE Payments
ADD ServiceId INT;

ALTER TABLE Payments
ADD CONSTRAINT FK_Payments_Services
FOREIGN KEY (ServiceId) REFERENCES Services(ServiceID);