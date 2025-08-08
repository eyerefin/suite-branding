from setuptools import setup, find_packages

with open("README.md", encoding="utf-8") as f:
    long_description = f.read()

setup(
    name="pressply_branding",
    version="0.0.1",
    description="Pressply Suite branding for ERPNext (v15)",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Pressply",
    author_email="support@pressply.com",
    license="MIT",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[],
    zip_safe=False,
) 