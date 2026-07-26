import re
from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

with open("charity/__init__.py") as f:
	version = re.search(r'__version__ = ["\']([^"\']+)["\']', f.read()).group(1)

setup(
	name="charity",
	version=version,
	description="charity",
	author="charity",
	author_email="charity",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
