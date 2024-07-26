FROM openjdk:21
WORKDIR /app
ADD target/leitnercards-0.0.1-SNAPSHOT.jar /app/leitnercards.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/leitnercards.jar"]