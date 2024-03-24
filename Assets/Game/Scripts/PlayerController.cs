using UnityEngine;
using UnityEngine.SceneManagement;

public class PlayerController : MonoBehaviour
{

    public static PlayerController Instance;

    public float moveSpeed = 5f;
    public bool isMovingRight = false;
    public bool isMovingLeft = false;
    public int roomIndex = 7;

    public bool onLimit = false;
      

    [Header("Vagoes"), Tooltip("Aqui vao os coliders dos respectivos vagoes")]
    public Collider2D[] vagoes = new Collider2D[15];

    public CameraController cameraController;
    public MapController mapController;

    //Anima��o:
    private Animator animator;

    //�udio:
    private AudioSource audioSource;

    //Lista de SFX:
    [SerializeField] private AudioClip[] sfxPassos;

    //Vari�veis �udio:
    [SerializeField] private float moveSFX = 0.1f;
    private float timerPassos = 0f;

    private RoomTrigger[] roomTriggers;

    void Awake() {
        Instance = this;
    }

    private void Start()
    {
        audioSource = GetComponent<AudioSource>();
        animator = GetComponent<Animator>();
        roomTriggers = GameObject.FindObjectsOfType<RoomTrigger>();
    }

    private void Update()
    {
        if (isMovingRight)
        {
            Vector3 newPosition = transform.position + Vector3.right * moveSpeed * Time.deltaTime;
            transform.position = newPosition;
            transform.rotation = Quaternion.identity;

            //Anima��o:
            animator.SetBool("Walking", true);

            //SFX Passos:
            if (timerPassos <= 0f)
            {
                audioSource.PlayOneShot(sfxPassos[UnityEngine.Random.Range(0, sfxPassos.Length)]);
                timerPassos = moveSpeed * moveSFX;
            }
            timerPassos = timerPassos - Time.deltaTime;

        }
        else if (isMovingLeft) 
        {
            Vector3 newPosition = transform.position + Vector3.left * moveSpeed * Time.deltaTime;
            transform.position = newPosition;
            transform.rotation = Quaternion.Euler(0f, 180f, 0f);

            //Anima��o:
            animator.SetBool("Walking", true);

            //SFX Passos:
            if (timerPassos <= 0f)
            {
                audioSource.PlayOneShot(sfxPassos[UnityEngine.Random.Range(0, sfxPassos.Length)]);
                timerPassos = moveSpeed * moveSFX;
            }
            timerPassos = timerPassos - Time.deltaTime;
        }
        else
        {
            //Anima��o:
            animator.SetBool("Walking", false);


            //SFX Passos:
            timerPassos = 0f;


        }
    }

    private void OnCollisionEnter2D(Collision2D collision) {
        if (collision.gameObject.CompareTag("mapLimit"))
            onLimit = true;
    }

    private void OnCollisionExit2D(Collision2D collision) {
        if (collision.gameObject.CompareTag("mapLimit"))
            onLimit = false;


    }

    public void Die() {
        SceneManager.LoadScene("GameOverScene");
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.gameObject.name == "metro")
        {
            roomIndex = other.GetComponent<RoomTrigger>().roomIndex;
            cameraController.SwitchRoom(roomIndex);
            mapController.SetPlayerMapPosition(roomIndex);
            mapController.RevealMap();


            if (roomIndex == 7) {

                other.GetComponent<SpriteRenderer>().enabled = true;

                foreach (Transform child in other.GetComponentInChildren<Transform>(true))
                    child.gameObject.SetActive(true);

            } else
                foreach (RoomTrigger room in roomTriggers) {
                    if (room.roomIndex != roomIndex) {

                        room.GetComponent<SpriteRenderer>().enabled = false;

                        foreach (Transform child in room.GetComponentInChildren<Transform>())
                            child.gameObject.SetActive(false);


                    } else{
                        room.GetComponent<SpriteRenderer>().enabled = true;

                        foreach (Transform child in room.GetComponentInChildren<Transform>(true)) 
                            child.gameObject.SetActive(true);
                    
                    }

                }
        }
    }

    public int GetRoomIndex()
    {
        return roomIndex;
    }

    public bool IsInMainRoom()
    {
        return roomIndex == 7;
    }

    public void StartMovingRight()
    {
        isMovingRight = true;
        isMovingLeft = false;
    }

    public void StopMovingRight()
    {
        isMovingRight = false;
    }

    public void StartMovingLeft()
    {
        isMovingLeft = true;
        isMovingRight = false;
    }

    public void StopMovingLeft()
    {
        isMovingLeft = false;
    }

    public void StopMoving()
    {
        isMovingRight = false;
        isMovingLeft = false;
    }
}
