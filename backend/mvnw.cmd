@ECHO OFF

SETLOCAL
SET MVNW_REPOURL=https://repo.maven.apache.org/maven2
SET MVNW_VERSION=3.9.6
SET MVNW_BASEDIR=%~dp0
SET MVNW_JAR=%MVNW_BASEDIR%.mvn\wrapper\maven-wrapper.jar

IF NOT EXIST "%MVNW_JAR%" (
    ECHO Apache Maven Wrapper not found. Downloading...
    IF NOT EXIST "%MVNW_BASEDIR%.mvn\wrapper" mkdir "%MVNW_BASEDIR%.mvn\wrapper"
    powershell -Command "Invoke-WebRequest -Uri %MVNW_REPOURL%/io/takari/maven-wrapper/%MVNW_VERSION%/maven-wrapper-%MVNW_VERSION%.jar -OutFile '%MVNW_JAR%'"
)

SET MAVEN_CMD_LINE_ARGS=%*

SET JAVA_EXE=java
IF DEFINED JAVA_HOME SET JAVA_EXE=%JAVA_HOME%\bin\java

"%JAVA_EXE%" -jar "%MVNW_JAR%" %MAVEN_CMD_LINE_ARGS%

ENDLOCAL
