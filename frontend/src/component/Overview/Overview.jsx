import React from 'react' 
import style from './OverviewStyle.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MonthlyEarnings from './OverviewChars/MonthlyEarning.jsx'
import TaskDistribution from './OverviewChars/TaskDistribution.jsx'
import { 
    faBell, 
    faUser, 
    faFolder, 
    faPlus, 
    faChevronRight, 
    faDollarSign, 
    faClock, 
    faEllipsisV, 
    faMobile,
    faStar 
} from '@fortawesome/free-solid-svg-icons'
import Header from './OverviewChars/Header.jsx'
export default function Overview() {
    return (
        <div className={style.overviewContainer}>
            <Header name="Dashboard Overview"/>

            <div className={style.welcomeSection}>
                <h1>Welcome back, <span className={style.highlight}>This is my real project</span>! 👋</h1>
                <p>Track, manage and complete your freelance projects</p>
                <div className={style.cardContainer}>
                <div className={style.statsCard}>
                    <div className={style.statsIcon}>
                        <FontAwesomeIcon icon={faFolder} />
                    </div>
                    <div className={style.statsContent}>
                        <div className={style.statsNumber}>12</div>
                        <div className={style.statsLabel}>Total Projects</div>
                        <h5>+2 this month</h5>
                    </div>
                </div>
                <div className={style.statsCard}>
                    <div className={`${style.statsIcon} ${style.dollar}`}>
                        <FontAwesomeIcon icon={faDollarSign} className={style.dollar}/>
                    </div>
                    <div className={style.statsContent}>
                        <div className={style.statsNumber}>$5,200</div>
                        <div className={style.statsLabel}>Total Earnings</div>
                        <h5 className={style.dollar}>+12 from last month</h5>
                    </div>
                </div>
                <div className={style.statsCard}>
                    <div className={`${style.statsIcon} ${style.clock}`}>
                        <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div className={style.statsContent}>
                        <div className={style.statsNumber}>3</div>
                        <div className={style.statsLabel}>Tasks Due</div>
                        <h5 className={style.clock}>Due this week</h5>
                    </div>
                </div>
                <div className={style.statsCard}>
                    <div className={`${style.statsIcon} ${style.bell}`}>
                        <FontAwesomeIcon icon={faBell} />
                    </div>
                    <div className={style.statsContent}>
                        <div className={style.statsNumber}>5</div>
                        <div className={style.statsLabel}>Recent Activity</div>
                        <h5 className={style.bell}>Today</h5>
                    </div>
                </div>
                </div>

                <div className={style.actionButtons}>
                    <button className={`${style.btn} ${style.primaryBtn}`}>
                        <FontAwesomeIcon icon={faPlus} /> Start a New Project
                    </button>
                    <button className={`${style.btn} ${style.secondaryBtn}`}>
                        View All Projects
                    </button>
                </div>
            </div>

            <div className={style.projectsHeader}>
                <h3>My Projects</h3>
                <a href="#" className={style.viewAllLink}>
                    View All <FontAwesomeIcon icon={faChevronRight} />
                </a>
            </div>



            <section className={style.projectSection}>
                <div className={style.projectGrid}>
                    {/* Project Card 1 */}
                    <div className={style.projectCard}>
                        <div className={style.projectHeader}>
                            <div className={style.projectIcon} style={{ backgroundColor: '#e6f7ff' }}>
                                <FontAwesomeIcon icon={faFolder} style={{ color: '#1890ff' }} />
                            </div>
                            <div className={style.projectActions}>
                                <button className={style.actionButton}>
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                            </div>
                        </div>
                        <h4 className={style.projectTitle}>E-commerce Website</h4>
                        <p className={style.projectDescription}>
                            Building a modern e-commerce platform with React and Node.js
                        </p>
                        <div className={style.projectMeta}>
                            <span className={style.deadline}>Due: Aug 30, 2023</span>
                            <span className={style.progress} style={{ color: '#52c41a' }}>65% Complete</span>
                        </div>
                        <div className={style.progressBar}>
                            <div className={style.progressFill} style={{ width: '65%', backgroundColor: '#52c41a' }}></div>
                        </div>
                        <div className={style.teamMembers}>
                            <div className={style.avatar} style={{ backgroundColor: '#f56a00' }}>JD</div>
                            <div className={style.avatar} style={{ backgroundColor: '#7265e6' }}>AM</div>
                            <div className={style.avatar} style={{ backgroundColor: '#ff4d4f' }}>+3</div>
                        </div>
                    </div>

                    {/* Project Card 2 */}
                    <div className={style.projectCard}>
                        <div className={style.projectHeader}>
                            <div className={style.projectIcon} style={{ backgroundColor: '#f6ffed' }}>
                                <FontAwesomeIcon icon={faMobile} style={{ color: '#52c41a' }} />
                            </div>
                            <div className={style.projectActions}>
                                <button className={style.actionButton}>
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                            </div>
                        </div>
                        <h4 className={style.projectTitle}>Mobile App UI Kit</h4>
                        <p className={style.projectDescription}>
                            Design and develop UI components for a mobile application
                        </p>
                        <div className={style.projectMeta}>
                            <span className={style.deadline}>Due: Sep 15, 2023</span>
                            <span className={style.progress} style={{ color: '#1890ff' }}>45% Complete</span>
                        </div>
                        <div className={style.progressBar}>
                            <div className={style.progressFill} style={{ width: '45%', backgroundColor: '#1890ff' }}></div>
                        </div>
                        <div className={style.teamMembers}>
                            <div className={style.avatar} style={{ backgroundColor: '#1890ff' }}>TS</div>
                            <div className={style.avatar} style={{ backgroundColor: '#722ed1' }}>+2</div>
                        </div>
                    </div>
                </div>
            </section>
            <section className={style.chartSection}>
                <div><MonthlyEarnings /></div>
                <div><TaskDistribution /></div>
            </section>



            <section className={style.currentProjects}>
    <div className={style.projectsHeader}>
        <h3>Current Projects</h3>
        <button className={style.newProjectBtn}>
            <FontAwesomeIcon icon={faPlus} /> New Project
        </button>
    </div>

    <table className={style.projectsTable}>
        <thead>
            <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Due Date</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {/* Row 1 */}
            <tr>
                <td>
                    <div className={style.projectInfo}>
                        <div className={style.projectName}>E-commerce Website</div>
                        <div className={style.projectDesc}>Full stack development</div>
                    </div>
                </td>
                <td>
                    <div className={style.clientInfo}>
                        <div>TechCorp Inc.</div>
                        <small>tech@techcorp.com</small>
                    </div>
                </td>
                <td><span className={`${style.status} ${style.inProgress}`}>In Progress</span></td>
                <td>
                    <div className={style.progressWrapper}>
                        <div className={style.progressBarTrack}>
                            <div className={style.progressBarFill} style={{ width: "65%", backgroundColor: "#2563eb" }}></div>
                        </div>
                        <span>65%</span>
                    </div>
                </td>
                <td>Mar 15, 2024</td>
                <td className={style.actions}>
                    <FontAwesomeIcon icon={faChevronRight} className={style.actionIcon} />
                    <FontAwesomeIcon icon={faEllipsisV} className={style.actionIcon} />
                </td>
            </tr>

            {/* Row 2 */}
            <tr>
                <td>
                    <div className={style.projectInfo}>
                        <div className={style.projectName}>Brand Identity</div>
                        <div className={style.projectDesc}>Logo and brand guidelines</div>
                    </div>
                </td>
                <td>
                    <div className={style.clientInfo}>
                        <div>StartupXYZ</div>
                        <small>hello@startupxyz.com</small>
                    </div>
                </td>
                <td><span className={`${style.status} ${style.completed}`}>Completed</span></td>
                <td>
                    <div className={style.progressWrapper}>
                        <div className={style.progressBarTrack}>
                            <div className={style.progressBarFill} style={{ width: "100%", backgroundColor: "#16a34a" }}></div>
                        </div>
                        <span>100%</span>
                    </div>
                </td>
                <td>Feb 28, 2024</td>
                <td className={style.actions}>
                    <FontAwesomeIcon icon={faChevronRight} className={style.actionIcon} />
                    <FontAwesomeIcon icon={faEllipsisV} className={style.actionIcon} />
                </td>
            </tr>

            {/* Row 3 */}
            <tr>
                <td>
                    <div className={style.projectInfo}>
                        <div className={style.projectName}>Mobile App Design</div>
                        <div className={style.projectDesc}>UI/UX design for iOS app</div>
                    </div>
                </td>
                <td>
                    <div className={style.clientInfo}>
                        <div>FinanceApp Ltd.</div>
                        <small>contact@financeapp.com</small>
                    </div>
                </td>
                <td><span className={`${style.status} ${style.review}`}>Review</span></td>
                <td>
                    <div className={style.progressWrapper}>
                        <div className={style.progressBarTrack}>
                            <div className={style.progressBarFill} style={{ width: "85%", backgroundColor: "#d97706" }}></div>
                        </div>
                        <span>85%</span>
                    </div>
                </td>
                <td>Mar 20, 2024</td>
                <td className={style.actions}>
                    <FontAwesomeIcon icon={faChevronRight} className={style.actionIcon} />
                    <FontAwesomeIcon icon={faEllipsisV} className={style.actionIcon} />
                </td>
            </tr>
        </tbody>
    </table>
</section>



<section className={style.summaryStats}>
    <div className={style.summaryCard}>
        <div className={`${style.iconWrapper} ${style.blue}`}>
            <FontAwesomeIcon icon={faClock} />
        </div>
        <h4 className={style.summaryTitle}>Hours This Month</h4>
        <div className={style.summaryValue} style={{ color: "#2563eb" }}>142</div>
        <p className={style.summaryNote}>+18 hours from last month</p>
    </div>

    <div className={style.summaryCard}>
        <div className={`${style.iconWrapper} ${style.green}`}>
            <FontAwesomeIcon icon={faUser} />
        </div>
        <h4 className={style.summaryTitle}>Active Clients</h4>
        <div className={style.summaryValue} style={{ color: "#16a34a" }}>8</div>
        <p className={style.summaryNote}>2 new clients this month</p>
    </div>

    <div className={style.summaryCard}>
        <div className={`${style.iconWrapper} ${style.purple}`}>
            <FontAwesomeIcon icon={faStar} />
        </div>
        <h4 className={style.summaryTitle}>Average Rating</h4>
        <div className={style.summaryValue} style={{ color: "#8b5cf6" }}>4.9</div>
        <p className={style.summaryNote}>Based on 24 reviews</p>
    </div>
</section>

        </div>

        
    )
}