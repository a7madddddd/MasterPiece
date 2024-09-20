use MASTER_PEICE



INSERT INTO users (Username, Email, PasswordHash, FirstName, ProfileImage, LastName, Phone, UserRole)
VALUES 
    ('johndoe', 'johndoe@example.com', 'hashed_password_123', 'John', 'john_doe_profile.jpg', 'Doe', '123-456-7890', 'user'),
    ('janedoe', 'janedoe@example.com', 'hashed_password_456', 'Jane', 'jane_doe_profile.jpg', 'Doe', '234-567-8901', 'admin'),
    ('alice_smith', 'alice.smith@example.com', 'hashed_password_789', 'Alice', 'alice_smith_profile.jpg', 'Smith', '345-678-9012', 'user'),
    ('bob_johnson', 'bob.johnson@example.com', 'hashed_password_012', 'Bob', 'bob_johnson_profile.jpg', 'Johnson', '456-789-0123', 'user'),
    ('emily_davis', 'emily.davis@example.com', 'hashed_password_345', 'Emily', 'emily_davis_profile.jpg', 'Davis', '567-890-1234', 'user');




	INSERT INTO Services (ServiceName, Description, Image, Price, IsActive)
VALUES 
    ('Ajloun Castle', 'Explore the historic Ajloun Castle with its stunning views and rich history.', 'ajloun_castle.jpg', 50.00, 1),
    ('Cabins', 'Enjoy a relaxing stay in our comfortable and scenic cabins.', 'cabins.jpg', 100.00, 1),
    ('Telefrik', 'Experience the breathtaking views with a ride on the Telefrik cable car.', 'telefrik.jpg', 30.00, 1),
    ('Zipline', 'Feel the thrill of ziplining across our beautiful landscapes.', 'zipline.jpg', 40.00, 1),
    ('Al-Rous Rural Resort', 'Relax in the serene environment of Al-Rous Rural Resort.', 'al_rous_resort.jpg', 80.00, 1),
    ('Natural Trails', 'Discover the natural beauty on our guided trails.', 'natural_trails.jpg', 25.00, 1),
    ('Rajib Waterfalls', 'Visit the stunning Rajib Waterfalls and enjoy the natural splendor.', 'rajib_waterfalls.jpg', 35.00, 1),
    ('Mar Elias', 'Explore the historical and religious significance of Mar Elias.', 'mar_elias.jpg', 45.00, 1),
    ('Forest Reserve', 'Experience the tranquility of our protected forest reserve.', 'forest_reserve.jpg', 60.00, 1);




	INSERT INTO ContactMessages (Name, Email, Subject, Message)
VALUES 
    ('Alice Smith', 'alice.smith@example.com', 'Inquiry about Services', 'I am interested in learning more about your services. Can you provide more details?'),
    ('Bob Johnson', 'bob.johnson@example.com', 'Feedback', 'Great experience with your service, but I would suggest adding more options.');



	INSERT INTO JoinRequests (Name, Email, Phone, Message, ServiceImage, Status)
VALUES 
    ('Emily Davis', 'emily.davis@example.com', '321-654-9870', 'Looking forward to joining your team as a tour guide.', 'join_request_image1.jpg', 'pending'),
    ('Michael Lee', 'michael.lee@example.com', '654-321-0987', 'Interested in contributing as a cabin manager.', 'join_request_image2.jpg', 'approved');




	INSERT INTO Profiles (UserID, Location, Email, Phone, ProfilePicture)
VALUES 
    (1, 'New York, NY', 'johndoe@example.com', '123-456-7890', 'profile_pic_johndoe.jpg'),
    (2, 'Los Angeles, CA', 'janedoe@example.com', '234-567-8901', 'profile_pic_janedoe.jpg');



	INSERT INTO Payments (UserID, Amount, PaymentDate, PaymentStatus, PaymentMethod)
VALUES 
    (1, 29.99, GETDATE(), 'completed', 'credit_card'),
    (2, 80.00, GETDATE(), 'pending', 'paypal');




	INSERT INTO Offers (Title, Description, StartDate, EndDate, DiscountPercentage, IsActive)
VALUES 
    ('Winter Sale', 'Get 15% off on all services during our Winter Sale!', '2024-12-01', '2024-12-31', 15.00, 1),
    ('Summer Special', 'Enjoy a 25% discount on selected tours this summer.', '2024-06-01', '2024-08-31', 25.00, 1);






	INSERT INTO AdminChats (UserID, AdminID, Message)
VALUES 
    (1, 1, 'Could you provide an update on the new tour packages?'),
    (2, 2, 'Please confirm the availability of additional cabins for the upcoming season.');





	INSERT INTO Bookings (UserID, ServiceID, BookingDate, NumberOfPeople, TotalAmount, Status)
VALUES 
    (1, 1, '2024-10-15', 2, 100.00, 'confirmed'),
    (2, 3, '2024-11-20', 1, 30.00, 'pending');


	INSERT INTO Reviews (UserID, ServiceID, Rating, Comment)
VALUES 
    (1, 1, 5, 'Fantastic tour of Ajloun Castle! Highly recommended.'),
    (2, 3, 4, 'The Telefrik ride was amazing, but the wait time was a bit long.');



	INSERT INTO tourism_statistics (year, clients, clients_change_percentage, returning_clients, returning_clients_change_percentage, reservations, reservations_change_percentage, items, items_change_percentage) 
VALUES 
(2016, 1642, NULL, 768, NULL, 11546, NULL, 3729, NULL),
(2017, 3527, 115.00, 145, -81.00, 9321, -19.00, 17429, 367.00);



UPDATE tourism_statistics
SET awwards = 22
WHERE year = 2017;


	--//////////////////////////////////////


INSERT INTO tourism_statistics (
    year, clients, clients_change_percentage, returning_clients, 
    returning_clients_change_percentage, reservations, reservations_change_percentage, 
    items, items_change_percentage, awwards, days, duration
) VALUES 
(2024, 1500, 5.25, 700, 2.50, 800, 6.00, 300, 4.75, 5, 'Sunday - Tuesday', '11:00 AM - 18:00 PM'),
(2024, 1300, 4.25, 600, 1.50, 600, 7.00, 400, 5.50, 5, 'Wednesday - Thursday', '09:00 AM - 19:00 PM'),
(2024, 1400, 3.25, 500, 4.50, 700, 5.00, 200, 2.30, 5, 'Friday - Saturday', '08:00 AM - 19:00 PM');