# CMAKE generated file: DO NOT EDIT!
# Generated by "MinGW Makefiles" Generator, CMake Version 3.29

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

SHELL = cmd.exe

# The CMake executable.
CMAKE_COMMAND = "C:\Program Files\CMake\bin\cmake.exe"

# The command to remove a file.
RM = "C:\Program Files\CMake\bin\cmake.exe" -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = D:\C_project\C_Plus_Plus_Data_Structure_Algorihms

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = D:\C_project\C_Plus_Plus_Data_Structure_Algorihms\build

# Include any dependencies generated for this target.
include CMakeFiles/MyCppProject.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include CMakeFiles/MyCppProject.dir/compiler_depend.make

# Include the progress variables for this target.
include CMakeFiles/MyCppProject.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/MyCppProject.dir/flags.make

CMakeFiles/MyCppProject.dir/C_Plus_Plus_Data_Structure_Algorihms.cpp.obj: CMakeFiles/MyCppProject.dir/flags.make
CMakeFiles/MyCppProject.dir/C_Plus_Plus_Data_Structure_Algorihms.cpp.obj: D:/C_project/C_Plus_Plus_Data_Structure_Algorihms/C_Plus_Plus_Data_Structure_Algorihms.cpp
CMakeFiles/MyCppProject.dir/C_Plus_Plus_Data_Structure_Algorihms.cpp.obj: CMakeFiles/MyCppProject.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --progress-dir=D:\C_project\C_Plus_Plus_Data_Structure_Algorihms\build\CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/MyCppProject.dir/C_Plus_Plus_Data_Structure_Algorihms.cpp.obj"
	C:\msys64\mingw64\bin\c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/MyCppProject.dir/C_Plus_Plus_Data_Structure_Algorihms.cpp.obj -MF CMakeFiles\MyCppProject.dir\C_Plus_Plus_Data_Structure_Algorihms.cpp.obj.d -o CMakeFiles\MyCppProject.dir\C_Plus_Plus_Data_Structure_Algorihms.cpp.obj -c D:\C_project\C_Plus_Plus_Data_Structure_Algorihms\C_Plus_Plus_Data_Structure_Algorihms.cpp

CMakeFiles/MyCppProject.dir/C_Plus_Plus_Data_Structure_Algorihms.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Preprocessing CXX source to CMakeFiles/MyCppProject.dir/C_Plus_Plus_Data_Structure_Algorihms.cpp.i"
	C:\msys64\mingw64\bin\c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E D:\C_project\C_Plus_Plus_Data_Structure_Algorihms\C_Plus_Plus_Data_Structure_Algorihms.cpp > CMakeFiles\MyCppProject.dir\C_Plus_Plus_Data_Structure_Algorihms.cpp.i

CMakeFiles/MyCppProject.dir/C_Plus_Plus_Data_Structure_Algorihms.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Compiling CXX source to assembly CMakeFiles/MyCppProject.dir/C_Plus_Plus_Data_Structure_Algorihms.cpp.s"
	C:\msys64\mingw64\bin\c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S D:\C_project\C_Plus_Plus_Data_Structure_Algorihms\C_Plus_Plus_Data_Structure_Algorihms.cpp -o CMakeFiles\MyCppProject.dir\C_Plus_Plus_Data_Structure_Algorihms.cpp.s

# Object files for target MyCppProject
MyCppProject_OBJECTS = \
"CMakeFiles/MyCppProject.dir/C_Plus_Plus_Data_Structure_Algorihms.cpp.obj"

# External object files for target MyCppProject
MyCppProject_EXTERNAL_OBJECTS =

MyCppProject.exe: CMakeFiles/MyCppProject.dir/C_Plus_Plus_Data_Structure_Algorihms.cpp.obj
MyCppProject.exe: CMakeFiles/MyCppProject.dir/build.make
MyCppProject.exe: CMakeFiles/MyCppProject.dir/linkLibs.rsp
MyCppProject.exe: CMakeFiles/MyCppProject.dir/objects1.rsp
MyCppProject.exe: CMakeFiles/MyCppProject.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --bold --progress-dir=D:\C_project\C_Plus_Plus_Data_Structure_Algorihms\build\CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Linking CXX executable MyCppProject.exe"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles\MyCppProject.dir\link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/MyCppProject.dir/build: MyCppProject.exe
.PHONY : CMakeFiles/MyCppProject.dir/build

CMakeFiles/MyCppProject.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles\MyCppProject.dir\cmake_clean.cmake
.PHONY : CMakeFiles/MyCppProject.dir/clean

CMakeFiles/MyCppProject.dir/depend:
	$(CMAKE_COMMAND) -E cmake_depends "MinGW Makefiles" D:\C_project\C_Plus_Plus_Data_Structure_Algorihms D:\C_project\C_Plus_Plus_Data_Structure_Algorihms D:\C_project\C_Plus_Plus_Data_Structure_Algorihms\build D:\C_project\C_Plus_Plus_Data_Structure_Algorihms\build D:\C_project\C_Plus_Plus_Data_Structure_Algorihms\build\CMakeFiles\MyCppProject.dir\DependInfo.cmake "--color=$(COLOR)"
.PHONY : CMakeFiles/MyCppProject.dir/depend

