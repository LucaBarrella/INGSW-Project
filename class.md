classDiagram
    direction LR
    BaseEntity <|-- Property
    Property "1" --o "1" ResidentialProperty : has
    Property "1" --o "1" CommercialProperty : has
    Property "1" --o "1" Garage : has
    Property "1" --o "1" Land : has

    class BaseEntity {
        +Long id
    }

    class Property {
        +String description
        +BigDecimal price
        +Integer area
        +Integer yearBuilt
        +Contract contract
        +PropertyCategory propertyCategory
        +PropertyStatus status
        +EnergyRating energyRating
        +User agent
        +Address address
    }

    class ResidentialProperty {
        +Property property
        +Integer numberOfRooms
        +Integer numberOfBathrooms
        +Integer parkingSpaces
        +Heating heating
        +Garden garden
        +boolean isFurnished
        +Integer floor
        +Integer numberOfFloors
        +boolean hasElevator
    }

    class CommercialProperty {
        +Property property
        +Integer numberOfRooms
        +Integer floor
        +Integer numberOfBathrooms
        +Integer numberOfFloors
        +boolean hasWheelchairAccess
        +Integer numeroVetrine
    }

    class Garage {
        +Property property
        +boolean hasSurveillance
        +Integer numberOfFloors
    }

    class Land {
        +Property property
        +boolean accessibleFromStreet
    }

    class Contract {
        +Long id
        +String type
    }

    class PropertyCategory {
        +Long id
        +String name
    }

    class User {
        +Long id
        +String name
        +String email
    }

    class Address {
        +Long id
        +String street
        +String city
        +String zipCode
        +String country
    }

    class Heating {
        +Long id
        +String type
    }

    class PropertyStatus {
        <<enum>>
        +AVAILABLE
        +SOLD
        +PENDING
    }

    class EnergyRating {
        <<enum>>
        +A
        +B
        +C
        +D
        +E
        +F
        +G
    }

    class Garden {
        <<enum>>
        +PRIVATE
        +SHARED
        +NONE
    }
