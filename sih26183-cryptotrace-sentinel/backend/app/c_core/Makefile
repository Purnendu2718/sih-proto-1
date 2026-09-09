CC ?= gcc
CFLAGS ?= -O3 -Wall -fPIC

UNAME_S := $(shell uname -s)
ifeq ($(OS),Windows_NT)
    TARGET := libtracer.dll
else ifeq ($(UNAME_S),Darwin)
    TARGET := libtracer.dylib
else
    TARGET := libtracer.so
endif

all: $(TARGET)

$(TARGET): tracer_core.c tracer_core.h
	$(CC) -shared -o $@ $(CFLAGS) tracer_core.c

clean:
	rm -f libtracer.so libtracer.dll libtracer.dylib *.o
