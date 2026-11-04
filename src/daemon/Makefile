ifndef PS5_PAYLOAD_SDK
$(error PS5_PAYLOAD_SDK is undefined; run tools/build-daemon.sh)
endif

include $(PS5_PAYLOAD_SDK)/toolchain/prospero.mk

ROOT := $(abspath $(CURDIR)/../..)
OUTPUT := $(ROOT)/build
ELF := $(OUTPUT)/restore.elf

UI_ASSETS := \
	$(ROOT)/assets/app/param.json \
	$(ROOT)/assets/app/icon0.png \
	$(ROOT)/src/ui/index.html \
	$(ROOT)/src/ui/styles.css \
	$(ROOT)/src/ui/app.js \
	$(ROOT)/src/ui/motion.js \
	$(ROOT)/src/ui/assets/ps5-showcase-crop.jpg

CFLAGS := -std=c11 -O2 -Wall -Wextra -Werror
LDLIBS := -lSceUserService -lpthread

all: $(ELF)

$(ELF): main.c $(UI_ASSETS) | $(OUTPUT)
	$(CC) $(CFLAGS) -o $@ main.c $(LDLIBS)

$(OUTPUT):
	mkdir -p $(OUTPUT)

clean:
	rm -f $(ELF)

.PHONY: all clean
