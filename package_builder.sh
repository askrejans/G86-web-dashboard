#!/bin/bash

set -e  # Exit on error

# Set variables
APP_NAME="g86-car-telemetry"
VERSION="1.0"
RELEASE="1"
ARCH="x86_64"
INSTALL_DIR="/opt/${APP_NAME}"
CONFIG_DIR="/etc/${APP_NAME}"
SERVICE_NAME_SPEEDUINO="g86-car-telemetry-speeduino"
SERVICE_NAME_GPS="g86-car-telemetry-gps"
SERVICE_NAME_WEB="g86-car-telemetry-web"
REACT_APP_DIR="/var/www/${APP_NAME}"

# Create RPM directory structure
rpm_dir="${APP_NAME}-${VERSION}-${RELEASE}.${ARCH}"
mkdir -p "${rpm_dir}/BUILDROOT/${rpm_dir}${INSTALL_DIR}"
mkdir -p "${rpm_dir}/BUILDROOT/${rpm_dir}${CONFIG_DIR}"
mkdir -p "${rpm_dir}/BUILDROOT/${rpm_dir}${REACT_APP_DIR}"
mkdir -p "${rpm_dir}/BUILDROOT/${rpm_dir}/usr/lib/systemd/system"
mkdir -p "${rpm_dir}/RPMS"
mkdir -p "${rpm_dir}/SOURCES"
mkdir -p "${rpm_dir}/SPECS"
mkdir -p "${rpm_dir}/SRPMS"

# Copy files to RPM directory
chmod -x g86-car-telemetry-speeduino.service
chmod -x g86-car-telemetry-gps.service
chmod -x g86-car-telemetry-web.service
chmod -x speeduino-to-mqtt/speeduino-to-mqtt
chmod -x gps-to-mqtt/gps-to-mqtt
cp gps-to-mqtt/gps-to-mqtt "${rpm_dir}/BUILDROOT/${rpm_dir}${INSTALL_DIR}/gps-to-mqtt"
cp speeduino-to-mqtt/speeduino-to-mqtt "${rpm_dir}/BUILDROOT/${rpm_dir}${INSTALL_DIR}/speeduino-to-mqtt"
cp -r web-dashboard/* "${rpm_dir}/BUILDROOT/${rpm_dir}${REACT_APP_DIR}"
cp g86-car-telemetry-speeduino.service "${rpm_dir}/BUILDROOT/${rpm_dir}/usr/lib/systemd/system/${SERVICE_NAME_SPEEDUINO}.service"
cp g86-car-telemetry-gps.service "${rpm_dir}/BUILDROOT/${rpm_dir}/usr/lib/systemd/system/${SERVICE_NAME_GPS}.service"
cp g86-car-telemetry-web.service "${rpm_dir}/BUILDROOT/${rpm_dir}/usr/lib/systemd/system/${SERVICE_NAME_WEB}.service"
cp gps-to-mqtt/settings.toml "${rpm_dir}/BUILDROOT/${rpm_dir}${CONFIG_DIR}/gps-to-mqtt.toml"
cp speeduino-to-mqtt/settings.toml "${rpm_dir}/BUILDROOT/${rpm_dir}${CONFIG_DIR}/speeduino-to-mqtt.toml"

# Create RPM spec file
cat <<EOF > "${rpm_dir}/SPECS/${APP_NAME}.spec"
Name: ${APP_NAME}
Version: ${VERSION}
Release: ${RELEASE}
Summary: Car Telemetry Application
License: MIT
Group: Applications/Utilities
BuildArch: ${ARCH}

%description
Car telemetry application with MQTT support and a web dashboard.

%files
%defattr(-,root,root,-)
${INSTALL_DIR}/*
${CONFIG_DIR}
${REACT_APP_DIR}
/usr/lib/systemd/system/${SERVICE_NAME_SPEEDUINO}.service
/usr/lib/systemd/system/${SERVICE_NAME_GPS}.service
/usr/lib/systemd/system/${SERVICE_NAME_WEB}.service

%post
# Make executables in /opt executable by all users
chmod -R +x ${INSTALL_DIR}

#Install npm serve web server
npm install serve

systemctl daemon-reload

# Add post-installation commands here (e.g., create users, start services, etc.)
/bin/systemctl enable ${SERVICE_NAME_SPEEDUINO}
/bin/systemctl start ${SERVICE_NAME_SPEEDUINO}

/bin/systemctl enable ${SERVICE_NAME_GPS}
/bin/systemctl start ${SERVICE_NAME_GPS}

/bin/systemctl enable ${SERVICE_NAME_WEB}
/bin/systemctl start ${SERVICE_NAME_WEB}

%preun
# Add pre-uninstallation commands here (e.g., stop services, etc.)
/bin/systemctl stop ${SERVICE_NAME_SPEEDUINO}
/bin/systemctl disable ${SERVICE_NAME_SPEEDUINO}

/bin/systemctl stop ${SERVICE_NAME_GPS}
/bin/systemctl disable ${SERVICE_NAME_GPS}

/bin/systemctl stop ${SERVICE_NAME_WEB}
/bin/systemctl disable ${SERVICE_NAME_WEB}

%changelog
* $(date "+%a %b %d %Y") Maintainer Arvis Skrējāns<arvis.skrejans@gmail.com> ${VERSION}-${RELEASE}
- Initial release.
EOF

# Build RPM package
echo "Before rpmbuild"
ls -lR "${rpm_dir}"
rpmbuild -bb --define "_topdir $(pwd)/${rpm_dir}" "${rpm_dir}/SPECS/${APP_NAME}.spec"
echo "After rpmbuild"
ls -lR "${rpm_dir}/RPMS"

# Check if RPM package is created
rpm_package="${rpm_dir}/RPMS/${ARCH}/${APP_NAME}-${VERSION}-${RELEASE}.${ARCH}.rpm"
if [ -f "${rpm_package}" ]; then
  echo "RPM package created successfully: ${rpm_package}"
  # Copy RPM package to the root directory
  cp "${rpm_package}" .
  echo "RPM package copied to the root directory."
else
  echo "Error: RPM package not found."
fi

# Remove settings.toml from /opt
rm -f "${deb_package_dir}${INSTALL_DIR}/gps-to-mqtt/settings.toml"
rm -f "${deb_package_dir}${INSTALL_DIR}/speeduino-to-mqtt/settings.toml"

# Create DEB package
deb_dir="${APP_NAME}_${VERSION}/DEBIAN"
mkdir -p "${deb_dir}"
# Post-installation script
cat <<EOF > "${deb_dir}/postinst"
#!/bin/bash
set -e

# Make executables in /opt executable by all users
chmod -R +x "/usr/${INSTALL_DIR}"

# Install npm serve web server
npm install -g serve

systemctl daemon-reload

# Enable and start services
systemctl enable ${SERVICE_NAME_SPEEDUINO}
systemctl start ${SERVICE_NAME_SPEEDUINO}

systemctl enable ${SERVICE_NAME_GPS}
systemctl start ${SERVICE_NAME_GPS}

systemctl enable ${SERVICE_NAME_WEB}
systemctl start ${SERVICE_NAME_WEB}

exit 0
EOF

# Pre-removal script
cat <<EOF > "${deb_dir}/prerm"
#!/bin/bash
set -e

# Stop services
systemctl stop ${SERVICE_NAME_SPEEDUINO} || true
systemctl stop ${SERVICE_NAME_GPS} || true
systemctl stop ${SERVICE_NAME_WEB} || true

# Disable services
systemctl disable ${SERVICE_NAME_SPEEDUINO} || true
systemctl disable ${SERVICE_NAME_GPS} || true
systemctl disable ${SERVICE_NAME_WEB} || true

exit 0
EOF

# Set permissions for the scripts
chmod 0755 "${deb_dir}/postinst"
chmod 0755 "${deb_dir}/prerm"
cat <<EOF > "${deb_dir}/control"
Package: ${APP_NAME}
Version: ${VERSION}-${RELEASE}
Architecture: amd64
Maintainer: Arvis Skrējāns<arvis.skrejans@gmail.com>
Description: Car Telemetry Application
 Car telemetry application with MQTT support and a web dashboard.
EOF

# Create DEB directory structure
deb_package_dir="${APP_NAME}_${VERSION}/usr"
mkdir -p "${deb_package_dir}${INSTALL_DIR}"
mkdir -p "${deb_package_dir}${CONFIG_DIR}"
mkdir -p "${deb_package_dir}${REACT_APP_DIR}"
mkdir -p "${deb_package_dir}/lib/systemd/system"

# Copy files to DEB package
cp gps-to-mqtt/gps-to-mqtt "${deb_package_dir}${INSTALL_DIR}/gps-to-mqtt"
cp speeduino-to-mqtt/speeduino-to-mqtt "${deb_package_dir}${INSTALL_DIR}/speeduino-to-mqtt"
cp -r web-dashboard/* "${deb_package_dir}${REACT_APP_DIR}"
cp gps-to-mqtt/settings.toml "${deb_package_dir}${CONFIG_DIR}/gps-to-mqtt.toml"
cp speeduino-to-mqtt/settings.toml "${deb_package_dir}${CONFIG_DIR}/speeduino-to-mqtt.toml"
cp g86-car-telemetry-speeduino.service "${deb_package_dir}/lib/systemd/system/${SERVICE_NAME_SPEEDUINO}.service"
cp g86-car-telemetry-gps.service "${deb_package_dir}/lib/systemd/system/${SERVICE_NAME_GPS}.service"
cp g86-car-telemetry-web.service "${deb_package_dir}/lib/systemd/system/${SERVICE_NAME_WEB}.service"

# Explicitly set executable permissions
chmod +x "${deb_package_dir}${INSTALL_DIR}/speeduino-to-mqtt"
chmod +x "${deb_package_dir}${INSTALL_DIR}/gps-to-mqtt"

# Build DEB package
dpkg-deb --build "${APP_NAME}_${VERSION}"

# Clean up
rm -rf "${rpm_dir}"
rm -rf "${APP_NAME}_${VERSION}"
