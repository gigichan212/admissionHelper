function Footer(){
    const currentDate = new Date().getFullYear()
    return (
        <footer>© {currentDate} 香城學校 版權所有 不得轉載</footer>
    )
}

export default Footer;