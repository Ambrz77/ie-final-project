# "BeguMagu Community Website" - Internet Engineering Final Project

## Installation

Clone the repository:

    git clone https://github.com/ambrz77/ie-final-project.git
  
Download & install XAMMP: (preferably 7.4.27 to avoid possible conflicts with the project)

    https://www.apachefriends.org/download.html
    
Then Download & install it with proper php.exe path exists in xammp installation folder:

    https://www.tutsmake.com/install-composer-windows/
    
## Initiation
    
Now open a command-line in the project directory and enter the following composer-related commands:

    composer install
    composer update
   
Then open XAMMP on your system and turn on Apache & MySQL services on your ports, then you can head into the following URL to access phpmyadmin panel:

    http://localhost/phpmyadmin
    
At this point you need to make a new database from the left panel, enter a name for it and then go to the "import" section and select note.sql file from the project's root. Then after importing you should go back to the command-line and enter this command to serve the website on localhost:

    php artisan serve
    
Now the website is available locally from this URL:

    http://127.0.0.1:8000
