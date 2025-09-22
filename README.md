# 🏨 Drizzle Drop Inn

Welcome to the official GitHub repository for **Drizzle Drop Inn**, a premium hotel located in Chennai, India. This static website offers a glimpse into the luxury and comfort we provide our guests.

---

## 🚀 Explore Our Hotel

Ready to see what makes us special? Click one of the options below to explore different parts of our website and learn about our features.

* **View Our Rooms**: Take a tour of our thoughtfully designed rooms, from the **Standard Room** perfect for solo travelers to the **Family Room** that offers spacious accommodation.
    * [Explore the Family Room](family-room.html)
    * [Explore the Deluxe Double Room](deluxe-room.html)

* **Discover Our Facilities**: Learn about the services and amenities that ensure a comfortable stay, including our rooftop restaurant and 24/7 reception.
    * [See All Facilities](index.html#facilities)

* **Meet Our Team**: Get to know the friendly faces ready to assist you.
    * [Visit the Reception](index.html#reception)

* **Book Your Stay**: Ready to plan your trip? Jump right to our booking page.
    * [Start Your Booking](index.html#contact)

---

## 💻 Tech Stack

This project is built using standard web technologies.

* **HTML**: Provides the structure and content for each page.
* **CSS**: Styles the website with custom layouts and a modern aesthetic. Key styles are split between `styles.css` for general design and `room-styles.css` for room-specific layouts and the booking modal.
* **JavaScript**: Powers interactive elements like the responsive navigation menu and the booking modal's functionality.

### How the Booking Modal Works

Our booking modal is a key interactive feature. It's powered by `room-script.js` and performs several functions:

1.  **Opens and Closes**: It opens on a button click and closes when you click outside of it or on the close button.
2.  **Calculates Price**: It calculates the total cost of your stay based on the number of nights selected. For example, the **Deluxe Double Room** is priced at ₹1,718 per night, and the **Family Room** is ₹1,964 per night.
3.  **Validates Form Data**: Before confirming, the script checks if the dates, name, email, and phone number are valid.
4.  **Simulates Booking**: The form submission is a simulation. It stores a booking confirmation in your browser's local storage and displays a success message with a unique booking ID.

Want to see the code in action?
* [View `room-script.js` for the booking logic](room-script.js)

---

## 📂 File Directory

Here's a quick look at our file structure.

* `index.html`: Our main page.
* `deluxe-room.html`: Page dedicated to the Deluxe Double Room.
* `family-room.html`: Page dedicated to the Family Room.
* `styles.css`: Global styles for the entire website.
* `room-styles.css`: Specific styles for the room detail pages.
* `script.js`: Core JavaScript for navigation and general site interactions.
* `room-script.js`: JavaScript for the booking modal.
* `drizzle1.jpg`, `drizzle2.jpg`, etc.: Image assets.

---

**Interested in contributing or have a question?** Feel free to open an issue or pull request. We'd love to hear from you!
