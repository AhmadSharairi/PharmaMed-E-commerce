namespace Core.Entities.OrderAggregate
{
    public class Address
    {
        public Address(){}
        public Address(string firstName, string lastName, string locationAddress, 
        string city, string state, string zipCode, string country, string phoneNumber)
        {
            FirstName = firstName;
            LastName = lastName;
            LocationAddress = locationAddress;
            City = city;
            ZipCode = zipCode;
            State= state;
            Country = country;
            PhoneNumber = phoneNumber;

        }


        public string FirstName { get; set; }


        public string LastName { get; set; }

        public string LocationAddress { get; set; }


        public string City { get; set; }

        public string State { get; set; }


        public string ZipCode { get; set; }


        public string Country { get; set; }

        public string PhoneNumber { get; set; }


    }
}